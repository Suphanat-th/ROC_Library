import { handleBossReport } from "@/server/bossReportHandler";

/** Thin Next.js route for `npm run dev`; the logic is shared with the Cloudflare Worker in worker/. */
export const dynamic = "force-dynamic";

export const POST = handleBossReport;
