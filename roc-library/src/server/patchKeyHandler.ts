import { createHash, timingSafeEqual } from "node:crypto";
import { clientAddress, createLimiter, json } from "@/server/http";

/**
 * Checks the Key in the Patch convert link. Two Keys, both set in the environment: the Patch key
 * changes every week, the Member key never does. The Keys never leave the server; the page only
 * learns "ok" or not. Wrong Keys are counted per address so guessing is slowed.
 */
const failures = createLimiter(10, 15 * 60 * 1000);

const same = (sent: string, expected: string) =>
  timingSafeEqual(createHash("sha256").update(sent).digest(), createHash("sha256").update(expected).digest());

export async function handlePatchKey(request: Request): Promise<Response> {
  const address = clientAddress(request);
  if (failures.isFull(address)) return json({ message: "ลองผิดหลายครั้ง กรุณารอสักครู่แล้วลองใหม่" }, 429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, 400);
  }

  const allowed = [process.env.PATCH_CONVERT_KEY, process.env.PATCH_CONVERT_MEMBER_KEY].filter(
    (key): key is string => Boolean(key),
  );
  const sent = typeof body.key === "string" ? body.key : "";
  const ok = Boolean(sent) && allowed.some((key) => same(sent, key));

  if (!ok) {
    failures.hit(address);
    return json({ ok: false }, 401);
  }
  failures.clear(address);
  return json({ ok: true });
}
