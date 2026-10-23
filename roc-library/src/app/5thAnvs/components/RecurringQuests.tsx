import { RECURRING_QUESTS } from "@/data/anniversary5thQuests";
import type { RecurringQuestGroup } from "@/types/anniversary";
import QuestTaskRow from "./QuestTaskRow";
import SectionHeading from "./SectionHeading";

const ART = "/assets/images/anvs/landing";

/** Band colour and picture of each group. */
const GROUP_STYLES = {
  daily: { band: "bg-warning text-warning-content", art: "sun.svg" },
  weekly: { band: "bg-info text-info-content", art: "calendar.svg" },
  world: { band: "bg-success text-success-content", art: "globe.svg" },
} as const;

function GroupCard({ group, wide = false }: { group: RecurringQuestGroup; wide?: boolean }) {
  const style = GROUP_STYLES[group.id];
  return (
    <div className="overflow-hidden rounded-3xl bg-base-100 shadow-lg">
      <div className={`relative flex items-center justify-between px-5 py-4 ${style.band}`}>
        <h3 className="text-xl font-black">{group.title}</h3>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ART}/${style.art}`} alt="" aria-hidden className="h-14 w-14 -rotate-12 drop-shadow" />
      </div>
      <div className="space-y-3 p-5">
        {group.note && <p className="rounded-xl bg-warning/20 px-3 py-2 text-sm">{group.note}</p>}
        {group.quests.length === 0 ? (
          <p className="text-sm text-base-content/70">กำลังรวบรวมข้อมูล</p>
        ) : (
          <div className={wide ? "grid gap-5 md:grid-cols-2" : "space-y-3"}>
            {group.quests.map((quest) => (
              <div key={quest.title} className="space-y-1.5">
                <p className="text-xs font-black uppercase tracking-widest text-(--anv-orange)">
                  {quest.title}
                </p>
                <ul className="space-y-2">
                  {quest.tasks.map((task) => (
                    <QuestTaskRow key={task.label} task={task} largeMonster={group.id === "world"} />
                  ))}
                </ul>
                {quest.notes?.map((note) => (
                  <p key={note} className="rounded-xl bg-warning/20 px-3 py-2 text-sm">
                    {note}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Daily and Weekly quests side by side; the World Quest on its own row below. */
export default function RecurringQuests({ index }: { index: string }) {
  const regular = RECURRING_QUESTS.filter((g) => g.id !== "world");
  const world = RECURRING_QUESTS.find((g) => g.id === "world");
  return (
    <section
      aria-labelledby="recurring-title"
      className="space-y-5 rounded-3xl bg-(--anv-orange)/10 p-5 sm:p-8"
    >
      <SectionHeading index={index} title="Quest · Daily / Weekly / World" id="recurring-title" />
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {regular.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
      {world && <GroupCard group={world} wide />}
    </section>
  );
}
