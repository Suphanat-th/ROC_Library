import { CoordinateText } from "./CoordinateLink";

const ART = "/assets/images/anvs/landing";

/** What a player must know before exchanging for an Anniversary reward. Same for every server. */
const NOTES: { title: string; detail: string; hint?: string; icon: string }[] = [
  {
    title: "[NFS] Gacha Ticket 1 ใบ",
    detail: "ต่อการแลกเปลี่ยน 1 ครั้ง",
    icon: "ticket.svg",
  },
  {
    title: "1,000,000 Zeny",
    detail: "ต่อการแลกเปลี่ยน 1 ครั้ง",
    icon: "coin.svg",
  },
  {
    title: "NPC Dr.Time",
    detail: "แผนที่ Invaded Prontera",
    hint: "พิกัด prt_q 139 182",
    icon: "castle.svg",
  },
];

export default function ExchangeNotes() {
  return (
    <section aria-labelledby="exchange-notes" className="space-y-3">
      <h3 id="exchange-notes" className="text-lg font-extrabold">
        Noted
      </h3>
      <ol className="grid gap-3 sm:grid-cols-3">
        {NOTES.map((note) => (
          <li
            key={note.title}
            className="flex items-center gap-3 rounded-2xl border-2 border-(--anv-orange)/30 bg-base-100 p-4 shadow"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ART}/${note.icon}`} alt="" aria-hidden className="h-14 w-14 shrink-0" />
            <div className="min-w-0 space-y-0.5">
              <p className="font-bold leading-snug">{note.title}</p>
              <p className="text-sm text-base-content/70">{note.detail}</p>
              {note.hint && (
                <p className="text-sm font-bold">
                  <CoordinateText text={note.hint} />
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
