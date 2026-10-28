import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  checkInput,
  issueKey,
  keyIsSigned,
  logRow,
  parsePrivateKey,
} from "@/utils/botLicense";

/**
 * Issues a botRedm licence key. The private key lives only in this server's environment
 * (BOT_LICENSE_PRIVATE_KEY) and the caller must send the admin password
 * (BOT_KEYGEN_ADMIN_PASSWORD). To move to Supabase Auth later, replace `isAdmin` below.
 */
export const dynamic = "force-dynamic";

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;

/** Wrong-password counts per address. Kept in memory, so it only slows guessing on a serverless host. */
const failures = new Map<string, { count: number; resetAt: number }>();

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const clientAddress = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

function isLocked(address: string) {
  const entry = failures.get(address);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    failures.delete(address);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function noteFailure(address: string) {
  const entry = failures.get(address);
  if (!entry || Date.now() > entry.resetAt) {
    failures.set(address, { count: 1, resetAt: Date.now() + LOCK_MS });
  } else {
    entry.count += 1;
  }
}

/** Compares in constant time, so the response time does not reveal how much matched. */
function isAdmin(sent: unknown, expected: string) {
  if (typeof sent !== "string") return false;
  const a = createHash("sha256").update(sent).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const adminPassword = process.env.BOT_KEYGEN_ADMIN_PASSWORD;
  const privateKeyText = process.env.BOT_LICENSE_PRIVATE_KEY;
  if (!adminPassword || !privateKeyText) {
    return json({ message: "ระบบออกคีย์ยังไม่ได้ตั้งค่าบนเซิร์ฟเวอร์" }, 503);
  }

  const address = clientAddress(request);
  if (isLocked(address)) {
    return json({ message: "ใส่รหัสผ่านผิดหลายครั้ง กรุณารอสักครู่แล้วลองใหม่" }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, 400);
  }

  if (!isAdmin(body.password, adminPassword)) {
    noteFailure(address);
    return json({ message: "รหัสผ่านไม่ถูกต้อง" }, 401);
  }
  failures.delete(address);

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

  return json({
    key: issued.key,
    issuedAt: issued.issuedAt,
    expiresAt: issued.expiresAt,
    row: logRow(issued, input.days),
  });
}
