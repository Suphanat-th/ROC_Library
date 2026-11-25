import { existsSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * `scripts/prepare-static.mjs` leaves this marker file before a Cloudflare build. It switches the
 * site to a static export (the Worker in `worker/` then serves it and handles /api/*). Without the
 * marker, `npm run dev` and `npm run build` behave as a normal Next.js app.
 */
const staticExport = existsSync(path.join(process.cwd(), ".static-export"));

const nextConfig: NextConfig = {
  reactCompiler: true,
  ...(staticExport && {
    output: "export",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
