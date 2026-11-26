import { adminClient } from "@/server/supabaseAdmin";
import { clientAddress, createLimiter, json } from "@/server/http";
import { normalizeUsername, usernameProblem } from "@/utils/memberRules";

/**
 * The two things a Member's browser cannot do for itself (Supabase Auth only signs in by email):
 *  - action "login": finds the email behind a username and signs in with the password, then hands back
 *    the session tokens. The email never leaves the server. Every failure answers the same message.
 *  - action "claim": saves the username a new Member picked when finishing the Invite (needs the Member's
 *    own access token). Without a username it only tells which username the Member already has.
 */
const failures = createLimiter(8, 15 * 60 * 1000);
const claims = createLimiter(20, 15 * 60 * 1000);

const BAD_LOGIN = "username หรือรหัสผ่านไม่ถูกต้อง";

export async function handleMember(request: Request): Promise<Response> {
  const db = adminClient();
  if (!db) return json({ message: "ระบบ Member ยังไม่ได้ตั้งค่าบนเซิร์ฟเวอร์" }, 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, 400);
  }
  const address = clientAddress(request);

  if (body.action === "login") {
    if (failures.isFull(address)) return json({ message: "ลองผิดหลายครั้ง กรุณารอสักครู่แล้วลองใหม่" }, 429);

    const username = typeof body.username === "string" ? normalizeUsername(body.username) : "";
    const password = typeof body.password === "string" ? body.password : "";
    const fail = () => {
      failures.hit(address);
      return json({ message: BAD_LOGIN }, 401);
    };
    if (usernameProblem(username) || !password || password.length > 200) return fail();

    const { data: row } = await db.from("members").select("user_id").eq("username", username).maybeSingle();
    if (!row) return fail();
    const { data: found } = await db.auth.admin.getUserById(row.user_id as string);
    const email = found?.user?.email;
    if (!email) return fail();

    const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return fail();
    const session = (await res.json()) as { access_token?: string; refresh_token?: string };
    if (!session.access_token || !session.refresh_token) return fail();

    failures.clear(address);
    return json({ ok: true, access_token: session.access_token, refresh_token: session.refresh_token });
  }

  if (body.action === "claim") {
    if (claims.hit(address)) return json({ message: "ลองบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่" }, 429);

    const token = typeof body.token === "string" ? body.token : "";
    if (!token) return json({ message: "ไม่พบ session กรุณาเปิดลิงก์จากอีเมลอีกครั้ง" }, 401);
    const { data: auth, error } = await db.auth.getUser(token);
    if (error || !auth.user) return json({ message: "ลิงก์หมดอายุ กรุณาขอลิงก์ใหม่" }, 401);
    const user = auth.user;

    const { data: existing } = await db.from("members").select("username").eq("user_id", user.id).maybeSingle();
    if (existing) return json({ ok: true, username: existing.username as string });
    if (typeof body.username !== "string") return json({ ok: true, username: null });

    const username = normalizeUsername(body.username);
    const problem = usernameProblem(username);
    if (problem) return json({ message: problem }, 400);

    const { error: insertError } = await db.from("members").insert({ user_id: user.id, username });
    if (insertError) {
      if (insertError.code === "23505") return json({ message: "username นี้ถูกใช้แล้ว" }, 409);
      return json({ message: "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง" }, 502);
    }
    // The username also goes into the user's profile so the browser can show it without asking again.
    await db.auth.admin.updateUserById(user.id, { user_metadata: { ...user.user_metadata, username } });
    return json({ ok: true, username });
  }

  return json({ message: "คำสั่งไม่ถูกต้อง" }, 400);
}
