import React from "react";
import { Quest, RequestItem } from "@/data/battlePassQuestData";
import QuestTicket from "./QuestTicket";

interface CollapsibleQuestTicketProps {
  title: string;
  quests: Quest[];
  activeQuests: Record<string, boolean>;
  setActiveQuests: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  formatRequest: (request: RequestItem[] | undefined) => string;
  onActiveSumChange?: (sum: number) => void;
}

export default function CollapsibleQuestTicket({
  title,
  quests,
  activeQuests,
  setActiveQuests,
  formatRequest,
  onActiveSumChange,
}: CollapsibleQuestTicketProps) {
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/10 shadow-sm">
      <div className="px-4 py-3 text-sm font-black text-primary">
        {title}
      </div>
      <div className="px-3 pb-3">
        <QuestTicket
          quests={quests}
          activeQuests={activeQuests}
          setActiveQuests={setActiveQuests}
          formatRequest={formatRequest}
          onActiveSumChange={onActiveSumChange}
        />
      </div>
    </div>
  );
}
