import type { AnniversaryInfoEntry } from "@/types/anniversary";

/**
 * The Chapter's story, small enough to sit on top of its own region, so it never hides the
 * neighbours. Its border and name take the region's colour.
 */
export default function ChapterPopup({
  entry,
  kind,
  color,
}: {
  entry: AnniversaryInfoEntry;
  /** what kind of quest the Chapter has, e.g. "สังหาร" */
  kind?: string;
  color: string;
}) {
  return (
    <article
      className="space-y-1.5 rounded-2xl border-4 bg-base-100 p-4 shadow-xl"
      style={{ borderColor: color }}
    >
      <h3
        className="anvs-tone text-base font-black tracking-wide"
        style={{ "--region": color } as React.CSSProperties}
      >
        {entry.numeral} · {entry.title}
      </h3>
      {entry.subtitle && (
        <p className="text-xs font-bold uppercase tracking-wide text-base-content/70">
          {entry.subtitle}
        </p>
      )}
      {entry.heading && <p className="font-black leading-snug">“{entry.heading}”</p>}
      {entry.detail?.map((line) => (
        <p key={line} className="text-sm leading-snug text-base-content/80">
          {line}
        </p>
      ))}
      {entry.tagline && <p className="text-sm font-bold italic">‘{entry.tagline}’</p>}
      {kind && (
        <p className="pt-0.5 text-xs font-bold">
          ภารกิจ: {kind} · <span className="text-base-content/70">คลิกเพื่อดูรายละเอียด</span>
        </p>
      )}
    </article>
  );
}
