# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout
- `roc-library/` — the active app: Next.js 16 (App Router) utility site for Ragnarok Online Classic (ROC). All work happens here.
- `AGENTS.md` — overlapping agent instructions; keep in sync with this file.

## Commands (run inside `roc-library/`)
```bash
npm run dev     # dotenv -e environment/.env.local -- next dev --webpack (env file must exist)
npm run build   # next build --webpack
npm run lint    # eslint
```
There is no test framework and no separate typecheck script; `npm run build` is the way to catch type errors. Do not add test commands without adding dependencies.

## Stack notes
- React is **18** (`react@^18.2.0`) despite AGENTS.md saying 19.
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`) — avoid manual `useMemo`/`useCallback` unless needed.
- Tailwind v4 + DaisyUI 5. Custom themes `roc-light` (default) / `roc-dark` defined in `src/app/globals.css`; toggled by `ThemeToggle` and saved in `localStorage` (`roc-theme`). Use theme tokens (`bg-base-*`, `text-base-content`, `text-primary`) rather than raw `gray-*`/`blue-*` for surfaces and text so dark mode works. Font: local Mali via `next/font/local`.
- Path alias `@/*` → `src/*`.
- Other libs: leaflet/react-leaflet (dungeon maps), swiper, framer-motion, html-to-image (image export), lucide-react.

## Architecture
- **Shell**: `src/app/layout.tsx` wraps everything in `LoadingProvider` (`src/context/LoadingContext.tsx`, global `useLoading()` overlay) and a DaisyUI drawer: `src/layout/navbar` on top, `src/layout/sidebar` as the nav menu. Adding a new tool page means creating `src/app/<route>/page.tsx` and adding a link in `sidebar.tsx`.
- **Routes** in `src/app/` are independent tools (calculators like `aspd-calc`, `exp-calc`, `vct-calc`, `calc-bp`; guides like `facewormnest-guide`, `toyfactory-guide`, `endless-tower`; `patch-convert`, `visual` (sprite viewer), `vip-search`, etc.). Page-specific components live in a colocated `components/` folder; shared ones in `src/components/`.
- **Data comes from three places**:
  1. `public/assets/json/*.json` fetched client-side by hook-style services (e.g. `useItemDb()` in `src/services/patchData/itemsService.tsx`).
  2. Hardcoded TS tables in `src/data/` (exp tables, ASPD, battle pass, enchant stones, research) and `src/services/mapData`, `src/services/mosters` (sic).
  3. `src/app/api/vip/route.ts` — the only API route; paginated/search over `src/data/vipDatabase.json` via `src/services/vip/vipService.ts`.
- **Hand-maintained event config**: `src/services/serverInfo/*` (exp/drop/death rate events with `DateFrom`/`DateTo`) and `src/config/maintenanceWindow.ts` are edited by hand as server events change. JS `Date` months are 0-indexed; times are Thailand (GMT+7) — use `src/utils/timezoneUtils.ts`.
- **Domain logic** in `src/utils/`: binary SPR/ACT sprite parsers (`sprParser.ts`, `actParser.ts`), `aspdFormula.ts`, `researchCalc.ts`.
- Types per feature in `src/types/`.

## Conventions
- UI text and many comments are in Thai; some source files are UTF-8 Thai that may display garbled in non-UTF-8 shells — preserve encoding when editing.
