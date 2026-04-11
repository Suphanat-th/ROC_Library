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
- `src/utils/` - SPR/ACT sprite parsers
- `public/assets/json/` - Static JSON item/patch data

## Data Loading
Services fetch from `/assets/json/*.json` at runtime. Ensure these files exist in `public/`.

## No Test Suite
No test framework configured. Do not add test commands without verifying dependencies.
