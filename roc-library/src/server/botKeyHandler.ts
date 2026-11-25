import { createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  checkInput,
  issueKey,
  keyIsSigned,
  logRow,
  parsePrivateKey,
} from "@/utils/botLicense";
import { keyRecordConfigured, listKeys, saveKey } from "@/utils/keyRecord";
import { isSignedIn, makeSession, sessionCookie } from "@/utils/botSession";
import { clientAddress, createLimiter, json } from "@/server/http";

/**
 * Issues a botRedm licence key. The private key lives only in this server's environment
 * (BOT_LICENSE_PRIVATE_KEY). The caller signs in once with the admin password
 * (BOT_KEYGEN_ADMIN_PASSWORD, action "login"), which sets a 3-hour cookie; issuing needs that cookie.
 * Action "status" tells the page whether the cookie is valid and, if so, returns the Key record.
 */

/** BOT_LICENSE_PRIVATE_KEY wins; otherwise the key is read from environment/license_private.key (local use only). */
function readPrivateKeyText() {
  const fromEnv = process.env.BOT_LICENSE_PRIVATE_KEY?.trim();
  if (fromEnv) return fromEnv;
  try {
    // Not available in the Worker (no file system): there the key must come from the secret.
    return readFileSync(path.join(process.cwd(), "environment", "license_private.key"), "utf8").trim();
  } catch {
    return "";
  }
}

/** Wrong-password counts per address, so guessing is slowed. */
const failures = createLimiter(5, 15 * 60 * 1000);

/** Compares in constant time, so the response time does not reveal how much matched. */
function isAdmin(sent: unknown, expected: string) {
  if (typeof sent !== "string") return false;
  const a = createHash("sha256").update(sent).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function handleBotKey(request: Request): Promise<Response> {
  const adminPassword = process.env.BOT_KEYGEN_ADMIN_PASSWORD;
  const privateKeyText = readPrivateKeyText();
  if (!adminPassword || !privateKeyText || !keyRecordConfigured()) {
    return json({ message: "ระบบออกคีย์ยังไม่ได้ตั้งค่าบนเซิร์ฟเวอร์" }, 503);
  }

  const address = clientAddress(request);
  if (failures.isFull(address)) {
    return json({ message: "ใส่รหัสผ่านผิดหลายครั้ง กรุณารอสักครู่แล้วลองใหม่" }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, 400);
  }

  const secure = new URL(request.url).protocol === "https:";

  if (body.action === "logout") {
    const res = json({ ok: true });
    res.headers.append("Set-Cookie", sessionCookie("", secure, 0));
    return res;
  }

  if (body.action === "login") {
    if (!isAdmin(body.password, adminPassword)) {
      failures.hit(address);
      return json({ message: "รหัสผ่านไม่ถูกต้อง" }, 401);
    }
    failures.clear(address);
    const res = json({ ok: true });
    res.headers.append("Set-Cookie", sessionCookie(makeSession(adminPassword), secure));
    return res;
  }

  if (body.action === "status") {
    if (!isSignedIn(request)) return json({ signedIn: false, rows: null });
    return json({ signedIn: true, rows: await listKeys() });
  }

  if (!isSignedIn(request)) return json({ message: "หมดเวลาเข้าสู่ระบบ กรุณาใส่รหัสผ่านใหม่" }, 401);

  const input = checkInput(body);
  if (!input.ok) return json({ message: input.message }, 400);

  let privateKey;
  try {
    privateKey = parsePrivateKey(privateKeyText);
  } catch {
    return json({ message: "กุญแจส่วนตัวบนเซิร์ฟเวอร์ตั้งค่าไม่ถูกต้อง" }, 500);
  }

  const issued = issueKey(privateKey, input);
  // Check the key just made before handing it out.
  if (!keyIsSigned(issued.key, privateKey)) {
    return json({ message: "สร้างคีย์ไม่สำเร็จ กรุณาลองอีกครั้ง" }, 500);
  }

  // The Key record comes first: a key that was not saved is not handed out.
  if (!(await saveKey(issued, input.days))) {
    return json({ message: "บันทึกลงฐานข้อมูลไม่สำเร็จ จึงยังไม่ออกคีย์ กรุณาลองสร้างใหม่อีกครั้ง" }, 502);
  }

  return json({
    key: issued.key,
    issuedAt: issued.issuedAt,
    expiresAt: issued.expiresAt,
    row: logRow(issued, input.days),
  });
}
