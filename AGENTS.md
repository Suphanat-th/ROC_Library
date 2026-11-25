# AGENTS.md

## Project
`roc-library/` - Next.js 16 + React 19 app for Ragnarok Online resource utilities.

## Commands
```bash
cd roc-library
npm run dev        # Requires dotenv-cli + environment/.env.local
npm run build      # next build --webpack
npm run lint        # ESLint only (no typecheck/test scripts)
```

## Key Tech
- Next.js App Router, React 19, Tailwind v4, DaisyUI 5
- React Compiler enabled (`reactCompiler: true` in next.config.ts)
- Path alias: `@/*` → `src/*`

## Architecture
- `src/app/` - Routes (file-based)
- `src/components/` - UI components
- `src/layout/` - NavBar, Sidebar, Footer
- `src/services/` - Data fetching (patchData, serverInfo)
- `src/types/` - TypeScript interfaces
- `/patch-convert` access: `?Key=` must equal env `PATCH_CONVERT_KEY` (weekly) or `PATCH_CONVERT_MEMBER_KEY` (permanent, Members); neither set means closed outside localhost
- `public/assets/json/PatchItemChanges.json` - per-item patch changes (from `compare_item_ids.py`); drawn as the Change note on `/patch-convert` (`ChangeNote.tsx`, `src/utils/itemChanges.ts`)
- `src/utils/` - SPR/ACT sprite parsers
- `public/assets/json/` - Static JSON item/patch data
- `/random-scroll/facebook` - Dev-only Comment draw: picks Winners from a Facebook post's comments, saved in gitignored `dev-data/comment-draw/` (needs `FB_PAGE_ACCESS_TOKEN`); hidden/404 in production
- `/mvp` - MVP Hunter: MVPs and Mini bosses are monsters with `mapspawn` in `src/services/mosters/mostersDb.tsx` (`miniBoss: true` marks a Mini boss; times follow RateMyServer's Renewal DB, `cooldown: [0, 0]` for one that returns within seconds); reports of wrong data go to the Supabase table `boss_reports` via `src/app/api/boss-report/route.ts` (table created by `supabase/boss_reports.sql`; read and ticked on the dev-only `/dev/mvp-reports` board; messages from the Feedback page likewise on `/dev/feedback`, columns in `supabase/feedback.sql`); Routes (fewest Warps, then least Zeny) come from `public/assets/json/MapLinks.json`, generated with the minimaps by `node scripts/extract-navigation.mjs "<path to data.grf>"`, whose top holds the hand-kept constants (towns, blocked maps, missing map names, the Gate Warp NPC)

## Data Loading
Services fetch from `/assets/json/*.json` at runtime. Ensure these files exist in `public/`.

## No Test Suite
No test framework configured. Do not add test commands without verifying dependencies.
