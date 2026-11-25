/** Small helpers shared by the /api handlers. They use only the standard Request/Response, so the
 *  same code runs in the Next.js dev routes (src/app/api) and in the Cloudflare Worker (worker/). */

export const json = (body: Record<string, unknown>, status = 200, headers?: HeadersInit) => {
  const res = new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
  if (headers) new Headers(headers).forEach((value, key) => res.headers.append(key, value));
  return res;
};

/** The visitor's address: Cloudflare's header first, then the usual proxy header. */
export const clientAddress = (request: Request) =>
  request.headers.get("cf-connecting-ip") ||
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
  "unknown";

/** Reads one cookie from the request. */
export function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

/** A per-address counter in memory. It only slows spam: each server instance counts on its own. */
export function createLimiter(max: number, windowMs: number) {
  const entries = new Map<string, { count: number; resetAt: number }>();
  return {
    /** Counts one more use and says whether the address is now over its limit. */
    hit(address: string) {
      const now = Date.now();
      const entry = entries.get(address);
      if (!entry || now > entry.resetAt) {
        entries.set(address, { count: 1, resetAt: now + windowMs });
        return false;
      }
      entry.count += 1;
      return entry.count > max;
    },
    /** True when the address already used up its allowance (without counting). */
    isFull(address: string) {
      const entry = entries.get(address);
      if (!entry) return false;
      if (Date.now() > entry.resetAt) {
        entries.delete(address);
        return false;
      }
      return entry.count >= max;
    },
    clear(address: string) {
      entries.delete(address);
    },
  };
}
