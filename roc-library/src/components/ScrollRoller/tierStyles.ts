import type { Tier } from "@/types/scroll";

// Single place that maps a Tier to theme tokens (full class names so Tailwind can see them).
export const TIER_ORDER: Tier[] = ["SSR", "SR", "A", "B", "C", "E"];

export const TIER_STYLE: Record<Tier, { border: string; text: string; bg: string; badge: string }> = {
  SSR: { border: "border-error", text: "text-error", bg: "bg-error/15", badge: "badge-error" },
  SR: { border: "border-warning", text: "text-warning", bg: "bg-warning/15", badge: "badge-warning" },
  A: { border: "border-primary", text: "text-primary", bg: "bg-primary/15", badge: "badge-primary" },
  B: { border: "border-info", text: "text-info", bg: "bg-info/15", badge: "badge-info" },
  C: { border: "border-success", text: "text-success", bg: "bg-success/15", badge: "badge-success" },
  E: { border: "border-neutral", text: "text-base-content/60", bg: "bg-neutral/10", badge: "badge-neutral" },
};
