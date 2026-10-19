# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Thai players of Ragnarok Online Classic (ROC) on the Thai private server. They typically keep the site open in a browser beside the game on a desktop PC, with mobile as a secondary device. Jobs: calculate stats mid-play (ASPD, EXP, VCT, BP), follow dungeon/event guides, look up items and patch changes, check server events and maintenance windows.

## Product Purpose
A utility site that gathers ROC players' calculators, guides, data viewers and patch tools in one place, so players need not juggle spreadsheets and scattered posts. Success: a player gets a correct answer or guide quickly while playing.

## Positioning
Data, formulas and event schedules are specific to the Thai ROC server and updated with its patches, and the toolkit is complete in one site (calculators, guides, sprite viewer, map viewer, patch converter, VIP search). It is not a generic Ragnarok wiki.

## Operating Context
Used alongside the running game, often in short lookups. Server events (exp/drop/death rate) and maintenance windows are hand-maintained and expressed in Thailand time (GMT+7). Content is patched by the maintainer after each server patch.

## Capabilities and Constraints
- Next.js 16 App Router, React 18, Tailwind v4 + DaisyUI 5, themes `roc-light` (default) and `roc-dark`.
- Tools live as independent routes under `src/app/`; navigation via the sidebar.
- UI text is Thai; the Mali font is used.
- Data sources: JSON in `public/assets/json`, hardcoded TS tables, and a single VIP search API route.

## Brand Commitments
Keep the existing "ROC Library" name, the Thai-language UI, the Mali font, and the `roc-light` / `roc-dark` DaisyUI themes. No other brand constraints were stated.

## Evidence on Hand
Real game data tables and sprite/map assets in `public/assets` and `src/data`. No testimonials, user counts or usage metrics are on hand; do not fabricate them.

## Product Principles
1. Answer first: the result of a calculation or lookup is the most visible thing on screen.
2. Accuracy to the Thai ROC server over generic Ragnarok data.
3. Built for glancing between game and browser: fast, scannable, minimal steps.
4. Works at desktop width beside the game and at phone width.
5. Thai-first copy and terminology matching what players say in game.

## Accessibility & Inclusion
No mandatory standard (such as WCAG AA) was set. Sensible contrast and readable Thai text in both themes are expected.
