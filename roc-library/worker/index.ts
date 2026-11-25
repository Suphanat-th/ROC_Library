import { handleBossReport } from "@/server/bossReportHandler";
import { handleBotKey } from "@/server/botKeyHandler";
import { handleFeedback } from "@/server/feedbackHandler";
import { handlePatchKey } from "@/server/patchKeyHandler";

/**
 * The Cloudflare Worker. Static files (the exported site) are served by Cloudflare itself without
 * running this code; only requests to /api/* come here (see run_worker_first in wrangler.jsonc).
 * Secrets and variables are read through process.env (nodejs_compat).
 */
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const routes: Record<string, (request: Request) => Promise<Response>> = {
  "/api/feedback": handleFeedback,
  "/api/boss-report": handleBossReport,
  "/api/botgeneratekey": handleBotKey,
  "/api/patch-key": handlePatchKey,
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const handler = routes[pathname];
    if (!handler) return env.ASSETS.fetch(request);
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ message: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", Allow: "POST" },
      });
    }
    try {
      return await handler(request);
    } catch {
      return new Response(JSON.stringify({ message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });
    }
  },
};
