// Prepares a Cloudflare build: removes everything that needs a Next.js server (the /api routes,
// the dev-only tools and the unused VIP search) and leaves `.static-export`, which makes
// next.config.ts export the site as static files. The /api routes are served by `worker/` instead.
//
// It deletes source folders, so it refuses to run unless it is on a build machine
// (CI, WORKERS_CI, CF_PAGES or STATIC_BUILD is set) or given --force. After a local --force run,
// restore with: git restore src && git clean -fd src && del .static-export
import { existsSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const onBuildMachine = ["CI", "WORKERS_CI", "CF_PAGES", "STATIC_BUILD"].some((name) => process.env[name]);
if (!onBuildMachine && !process.argv.includes("--force")) {
  console.error("prepare-static: this deletes source folders. Run it only on a build machine, or pass --force.");
  process.exit(1);
}

const root = process.cwd();
const removed = [
  "src/app/api",
  "src/app/dev",
  "src/app/vip-search",
  "src/app/random-scroll/facebook",
];

for (const dir of removed) {
  const target = path.join(root, dir);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`prepare-static: removed ${dir}`);
  }
}

writeFileSync(path.join(root, ".static-export"), "static export for Cloudflare\n");
console.log("prepare-static: .static-export written");
