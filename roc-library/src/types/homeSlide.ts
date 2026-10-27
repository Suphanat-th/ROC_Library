import type { Tier } from "@/types/scroll";

/** The colours of a slide's poster. Each event keeps its own look in both Theme modes. */
export type SlideTone = "anniversary" | "desert" | "festa" | "libra";

/** The picture group on the right of a slide. */
export type SlideArt =
  | { kind: "party" }
  | { kind: "monsters"; images: { src: string; alt: string }[] }
  | { kind: "reel"; prizes: { src: string; tier: Tier; name: string }[] };

/** One banner of the home page slider. */
export interface HomeSlide {
  id: string;
  href: string;
  tone: SlideTone;
  /** The small label above the title. */
  kicker: string;
  title: string;
  description: string;
  /** A short factual line under the description, such as the event dates. */
  meta?: string;
  cta: string;
  /** The big mark behind the pictures, such as "5" or "×3". */
  glyph?: string;
  art: SlideArt;
}
