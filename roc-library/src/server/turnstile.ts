/**
 * Human check (Cloudflare Turnstile), verified on the server before any database or email work.
 * Fails closed: a token that cannot be verified (Cloudflare unreachable, secret missing in production) is a refusal.
 * Without TURNSTILE_SECRET_KEY the check is skipped only outside production, so local development needs no keys.
 */
export type HumanCheck = "ok" | "failed";

export async function verifyHuman(token: unknown, address: string): Promise<HumanCheck> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV === "production" ? "failed" : "ok";
  if (typeof token !== "string" || !token || token.length > 2048) return "failed";

  try {
    const form = new URLSearchParams({ secret, response: token });
    if (address !== "unknown") form.set("remoteip", address);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    if (!res.ok) return "failed";
    const data = (await res.json()) as { success?: boolean };
    return data.success ? "ok" : "failed";
  } catch {
    return "failed";
  }
}

export const HUMAN_CHECK_MESSAGE = "ยืนยันตัวตนไม่สำเร็จ กรุณาลองอีกครั้ง";
