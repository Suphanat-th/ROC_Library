/** What a player must know before exchanging for an Anniversary reward. Same for every server. */
const NOTES: { title: string; detail: string; hint?: string }[] = [
  {
    title: "[NFS] Gacha Ticket 1 ใบ",
    detail: "ต่อการแลกเปลี่ยน 1 ครั้ง",
  },
  {
    title: "1,000,000 Zeny",
    detail: "ต่อการแลกเปลี่ยน 1 ครั้ง",
  },
  {
    title: "NPC Dr.Time",
    detail: "แผนที่ Invaded Prontera",
    hint: "พิกัด prt_q 139 182",
  },
];

export default function ExchangeNotes() {
  return (
    <section aria-labelledby="exchange-notes" className="space-y-3">
      <h2 id="exchange-notes" className="text-lg font-extrabold">
        Noted
      </h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {NOTES.map((note, i) => (
          <li
            key={note.title}
            className="flex gap-3 rounded-2xl border-2 border-(--anv-orange)/30 bg-base-100 p-4 shadow"
          >
            <span
              aria-hidden
              className="text-4xl font-black leading-none text-(--anv-orange)"
            >
              {i + 1}
            </span>
            <div className="min-w-0 space-y-0.5">
              <p className="font-bold leading-snug">{note.title}</p>
              <p className="text-sm text-base-content/70">{note.detail}</p>
              {note.hint && (
                <p className="text-sm font-bold text-(--anv-orange)">{note.hint}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
