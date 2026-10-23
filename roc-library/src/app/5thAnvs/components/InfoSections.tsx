"use client";
import { ANNIVERSARY_INFO_SECTIONS } from "@/data/anniversary5thInfo";
import type { AnniversaryInfoEntry, AnniversaryInfoSection } from "@/types/anniversary";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ART = "/assets/images/anvs/landing";
/** Medallion colour of each Chapter, in order; white text on every one. */
const CHAPTER_COLORS = ["#2563eb", "#15803d", "#0f766e", "#dc2626", "#b45309", "#7c3aed"];

/** Lines of an entry, or the note that the content is still being collected. */
function Detail({ entry, className = "" }: { entry: AnniversaryInfoEntry; className?: string }) {
  return entry.detail?.length ? (
    <ul className={`space-y-0.5 text-sm ${className}`}>
      {entry.detail.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  ) : (
    <p className={`text-sm opacity-70 ${className}`}>กำลังรวบรวมข้อมูล</p>
  );
}

/**
 * Chapters along a dashed path. From md up the path runs down the middle and the
 * cards alternate left and right; below md it runs down the left edge.
 */
function Route({ entries }: { entries: AnniversaryInfoEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-box bg-base-100 p-6 text-center text-base-content/70">
        กำลังรวบรวมข้อมูล
      </p>
    );
  }
  return (
    <ol className="relative">
      <span
        aria-hidden
        className="absolute bottom-0 left-[22px] top-0 w-1 bg-[repeating-linear-gradient(to_bottom,var(--anv-orange)_0_8px,transparent_8px_16px)] opacity-60 md:left-1/2 md:-translate-x-1/2"
      />
      {entries.map((entry, i) => (
        <li key={entry.title} className="relative pb-8 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
          <span
            aria-hidden
            className="absolute left-0 top-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-base-100 text-sm font-black text-white shadow-md md:left-1/2 md:-translate-x-1/2"
            style={{ backgroundColor: CHAPTER_COLORS[i % CHAPTER_COLORS.length] }}
          >
            {entry.numeral ?? i + 1}
          </span>
          <div className={i % 2 === 1 ? "md:col-start-2" : "md:col-start-1"}>
            <Reveal delay={0.05}>
              <article className="flex gap-4 rounded-3xl bg-base-100 p-5 shadow-lg">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-(--anv-orange) to-(--anv-cream) sm:h-24 sm:w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${ART}/${entry.mystery ? "mystery" : "castle"}.svg`}
                    alt={entry.mystery ? "ยังไม่เปิดเผย" : ""}
                    className="h-14 w-14 object-contain drop-shadow sm:h-16 sm:w-16"
                  />
                </span>
                <div className="min-w-0 space-y-1.5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-(--anv-orange)">
                    {entry.title}
                  </h3>
                  {entry.subtitle && (
                    <p className="text-xs font-bold uppercase tracking-wide text-base-content/70">
                      Chapter {entry.numeral} · {entry.subtitle}
                    </p>
                  )}
                  {entry.heading && (
                    <p className="text-lg font-black leading-snug">“{entry.heading}”</p>
                  )}
                  <Detail entry={entry} className="text-base-content/80" />
                  {entry.tagline && (
                    <p className="text-sm font-bold italic">‘{entry.tagline}’</p>
                  )}
                </div>
              </article>
            </Reveal>
          </div>
        </li>
      ))}
    </ol>
  );
}

const TILE_STYLES = [
  { tone: "bg-warning text-warning-content", art: "sun.svg" },
  { tone: "bg-info text-info-content", art: "calendar.svg" },
  { tone: "bg-success text-success-content", art: "globe.svg" },
];

/** A few big coloured cards, each with its own picture. */
function Tiles({ entries }: { entries: AnniversaryInfoEntry[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {entries.map((entry, i) => {
        const style = TILE_STYLES[i % TILE_STYLES.length];
        return (
          <li key={entry.title}>
            <Reveal delay={i * 0.12}>
              <div
                className={`relative min-h-48 overflow-hidden rounded-3xl p-6 shadow-lg transition-transform motion-safe:hover:-translate-y-1 ${style.tone}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ART}/${style.art}`}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -bottom-6 -right-4 h-36 w-36 -rotate-12 opacity-90"
                />
                <div className="relative max-w-[70%] space-y-2">
                  <h3 className="text-2xl font-black leading-tight">{entry.title}</h3>
                  <Detail entry={entry} />
                </div>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

function Section({ section, index }: { section: AnniversaryInfoSection; index: number }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="scroll-mt-20 space-y-5"
    >
      <SectionHeading
        index={String(index + 1).padStart(2, "0")}
        title={section.title}
        id={`${section.id}-title`}
      />
      {section.summary && <p className="text-base-content/70">{section.summary}</p>}
      {section.layout === "route" ? (
        <Route entries={section.entries} />
      ) : (
        <Tiles entries={section.entries} />
      )}
    </section>
  );
}

/** The event info sections above the Rewards, filled from the info data file. */
export default function InfoSections() {
  return (
    <>
      {ANNIVERSARY_INFO_SECTIONS.map((section, i) => (
        <Section key={section.id} section={section} index={i} />
      ))}
    </>
  );
}
