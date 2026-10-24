import { Gift } from "lucide-react";
import type { InfoPanel, QuestTask } from "@/types/anniversary";
import QuestTaskRow from "./QuestTaskRow";

export const fmt = (n: number) => n.toLocaleString("en-US");

/** The rewards of a quest, in a box that says so, so they are never mistaken for the steps. */
export function RewardBox({
  title,
  tasks,
  wide = false,
}: {
  title: string;
  tasks: QuestTask[];
  /** lay the rewards out in two columns when there is room */
  wide?: boolean;
}) {
  return (
    <div className="space-y-2 rounded-2xl border-2 border-(--anv-orange) bg-(--anv-orange)/10 p-3">
      <p className="flex items-center gap-2 text-sm font-black">
        <Gift aria-hidden className="h-4 w-4 text-(--anv-orange)" />
        {title}
      </p>
      <ul className={wide ? "grid gap-2 md:grid-cols-2" : "space-y-2"}>
        {tasks.map((task) => (
          <QuestTaskRow key={task.label} task={task} />
        ))}
      </ul>
    </div>
  );
}

/** A small box of facts: one line for each thing given, and label/value lines. */
export function Panel({ panel }: { panel: InfoPanel }) {
  return (
    <div className="space-y-2 rounded-2xl border-2 border-(--anv-orange)/40 p-3">
      <p className="font-black">{panel.title}</p>
      {panel.chips && (
        <ul className="space-y-1.5">
          {panel.chips.map((chip) => (
            <li key={chip} className="rounded-xl bg-(--anv-orange)/15 px-4 py-1.5 font-bold">
              {chip}
            </li>
          ))}
        </ul>
      )}
      {panel.facts?.map((fact) => (
        <p key={fact.label} className="flex justify-between gap-3 text-sm">
          <span className="text-base-content/70">{fact.label}</span>
          <span className="font-bold">{fact.value}</span>
        </p>
      ))}
    </div>
  );
}
