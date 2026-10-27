import type { Tier } from "@/types/scroll";

// Single place that maps a Tier to theme tokens (full class names so Tailwind can see them).
export const TIER_ORDER: Tier[] = ["SSR", "SR", "R", "A", "B", "C", "E"];

interface TierStyle {
  border: string;
  text: string;
  bg: string;
  /** Stronger tint, used for the rare Tiers in lists. */
  bgStrong: string;
  badge: string;
  /** Filled chip with readable text; the rare Tiers also glow. */
  solid: string;
  /** Soft outer glow around a card. */
  glow: string;
}

export const TIER_STYLE: Record<Tier, TierStyle> = {
  SSR: {
    border: "border-error",
    text: "text-error",
    bg: "bg-error/15",
    bgStrong: "bg-error/30",
    badge: "badge-error",
    solid: "bg-error text-error-content shadow-[0_0_14px] shadow-error",
    glow: "shadow-error/40",
  },
  SR: {
    border: "border-warning",
    text: "text-warning",
    bg: "bg-warning/15",
    bgStrong: "bg-warning/25",
    badge: "badge-warning",
    solid: "bg-warning text-warning-content shadow-[0_0_12px] shadow-warning",
    glow: "shadow-warning/40",
  },
  // The theme has no purple token, and every other token is taken by a Tier, so R borrows violet.
  R: {
    border: "border-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/15",
    bgStrong: "bg-violet-500/25",
    badge: "border-violet-500 bg-violet-500 text-white",
    solid: "bg-violet-600 text-white shadow-[0_0_12px] shadow-violet-500",
    glow: "shadow-violet-500/40",
  },
  A: {
    border: "border-primary",
    text: "text-primary",
    bg: "bg-primary/15",
    bgStrong: "bg-primary/15",
    badge: "badge-primary",
    solid: "bg-primary text-primary-content",
    glow: "shadow-primary/40",
  },
  B: {
    border: "border-info",
    text: "text-info",
    bg: "bg-info/15",
    bgStrong: "bg-info/15",
    badge: "badge-info",
    solid: "bg-info text-info-content",
    glow: "shadow-info/40",
  },
  C: {
    border: "border-success",
    text: "text-success",
    bg: "bg-success/15",
    bgStrong: "bg-success/15",
    badge: "badge-success",
    solid: "bg-success text-success-content",
    glow: "shadow-success/40",
  },
  E: {
    border: "border-neutral",
    text: "text-base-content/60",
    bg: "bg-neutral/10",
    bgStrong: "bg-neutral/10",
    badge: "badge-neutral",
    solid: "bg-neutral text-neutral-content",
    glow: "shadow-neutral/40",
  },
};
