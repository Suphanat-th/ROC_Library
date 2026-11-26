import { createHash, timingSafeEqual } from "node:crypto";
import { adminClient } from "@/server/supabaseAdmin";
import { clientAddress, createLimiter, json } from "@/server/http";

/**
 * The Member admin page's commands. Every command carries the admin password (MEMBER_ADMIN_PASSWORD),
 * which is checked here in constant time; wrong passwords are counted per address.
 *  - "list": every Member (email, username, joined, suspended)
 *  - "invite": emails an Invite link
 *  - "suspend" / "unsuspend": blocks or restores sign-in
 *  - "remove": deletes the Member
 */
const failures = createLimiter(5, 15 * 60 * 1000);

const same = (sent: unknown, expected: string) =>
  typeof sent === "string" &&
  timingSafeEqual(createHash("sha256").update(sent).digest(), createHash("sha256").update(expected).digest());

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FOREVER = "876000h";

export async function handleMemberAdmin(request: Request): Promise<Response> {
  const expected = process.env.MEMBER_ADMIN_PASSWORD;
  const db = adminClient();
  if (!expected || !db) return json({ message: "หน้าแอดมินยังไม่ได้ตั้งค่าบนเซิร์ฟเวอร์" }, 503);

  const address = clientAddress(request);
  if (failures.isFull(address)) return json({ message: "ใส่รหัสผ่านผิดหลายครั้ง กรุณารอสักครู่แล้วลองใหม่" }, 429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, 400);
  }
  if (!same(body.password, expected)) {
    failures.hit(address);
    return json({ message: "รหัสผ่านไม่ถูกต้อง" }, 401);
  }
  failures.clear(address);

  const id = typeof body.id === "string" ? body.id : "";

  switch (body.action) {
    case "list": {
      const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return json({ message: "อ่านรายชื่อไม่สำเร็จ" }, 502);
      const { data: names } = await db.from("members").select("user_id, username");
      const byId = new Map((names ?? []).map((r) => [r.user_id as string, r.username as string]));
      const now = Date.now();
      const members = data.users.map((u) => ({
        id: u.id,
        email: u.email ?? "",
        username: byId.get(u.id) ?? null,
        createdAt: u.created_at,
        suspended: Boolean(u.banned_until && new Date(u.banned_until).getTime() > now),
      }));
      members.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return json({ ok: true, members });
    }
    case "invite": {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!EMAIL.test(email) || email.length > 254) return json({ message: "อีเมลไม่ถูกต้อง" }, 400);
      const origin = request.headers.get("origin") || new URL(request.url).origin;
      const { error } = await db.auth.admin.inviteUserByEmail(email, { redirectTo: `${origin}/member/set-password` });
      if (error) {
        console.error("invite error:", error.message);
        return json({ message: `เชิญไม่สำเร็จ: ${error.message}` }, 400);
      }
      return json({ ok: true });
    }
    case "suspend":
    case "unsuspend": {
      if (!id) return json({ message: "ไม่พบ Member" }, 400);
      const { error } = await db.auth.admin.updateUserById(id, {
        ban_duration: body.action === "suspend" ? FOREVER : "none",
      });
      return error ? json({ message: "บันทึกไม่สำเร็จ" }, 502) : json({ ok: true });
    }
    case "remove": {
      if (!id) return json({ message: "ไม่พบ Member" }, 400);
      const { error } = await db.auth.admin.deleteUser(id);
      return error ? json({ message: "ลบไม่สำเร็จ" }, 502) : json({ ok: true });
    }
    default:
      return json({ message: "คำสั่งไม่ถูกต้อง" }, 400);
  }
}
