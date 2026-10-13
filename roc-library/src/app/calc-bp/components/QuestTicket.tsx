import React from "react";
import Image from "next/image";
import { Quest, RequestItem } from "@/data/battlePassQuestData";

interface QuestTicketProps {
  quests: Quest[];
  activeQuests: Record<string, boolean>;
  setActiveQuests: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  formatRequest: (request: RequestItem[] | undefined) => string;
  onActiveSumChange?: (sum: number) => void;
}

export default function QuestTicket({
  quests,
  activeQuests,
  setActiveQuests,
  formatRequest,
  onActiveSumChange,
}: QuestTicketProps) {
  const toggleQuest = (questName: string, isActive: boolean) => {
    setActiveQuests((currentQuests) => ({
      ...currentQuests,
      [questName]: isActive,
    }));
    onActiveSumChange?.(
      quests.reduce(
        (sum, quest) =>
          sum +
          (quest.name === questName
            ? isActive
              ? quest.reward
              : 0
            : activeQuests[quest.name]
              ? quest.reward
              : 0),
        0,
      ),
    );
  };

  return (
    <div className="space-y-2">
      {quests.map((quest) => {
        const isActive = activeQuests[quest.name] || false;
        const imageSource = quest.image;

        return (
          <div
            key={`${quest.name}-${quest.dateRange}`}
            className={`form-control overflow-hidden rounded-xl border-2 shadow-sm transition-all duration-200 ${isActive ? "border-primary bg-linear-to-r from-primary/10 to-base-100 shadow-lg shadow-primary/20 ring-2 ring-primary/30" : " bg-base-200 hover:border-primary/40 hover:bg-base-100 hover:shadow-md"}`}
          >
            <label className={`relative flex cursor-pointer items-center gap-3 p-3 pt-7 text-base-content ${isActive ? "" : "opacity-70 hover:opacity-100"}`}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) =>
                  toggleQuest(quest.name, event.target.checked)
                }
                className="sr-only"
              />
              {imageSource ? (
                <span className={`relative h-30 w-30 shrink-0 overflow-hidden rounded-lg border-2 bg-primary/10 transition-all duration-200 ${isActive ? "border-primary shadow-md shadow-primary/30" : "border-base-300 grayscale"}`}>
                  <Image
                    src={imageSource}
                    alt={quest.name}
                    fill
                    sizes="120px"
                    className={`object-cover transition-all duration-200 ${isActive ? "scale-105" : "scale-100 grayscale"}`}
                  />
                </span>
              ) : (
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 text-lg font-black transition-all duration-200 ${isActive ? "border-primary bg-primary/15 text-primary" : "border-base-300 bg-base-300 text-base-content/60"}`}>
                  {quest.name.charAt(0)}
                </span>
              )}
              <span className="label-text flex-1">
                <span className="text-md font-bold">{quest.name} ({formatRequest(quest.request)})</span>
                <br />
                {quest.reward} แต้ม
              </span>
              <span className={`absolute right-3 top-2 rounded-full px-3 py-1 text-[10px] font-black tracking-wider transition-colors ${isActive ? "bg-primary text-primary-content shadow-md shadow-primary/30" : "bg-base-300 text-base-content/70"}`}>
                {isActive ? "ON" : "OFF"}
              </span>
              <span className={`absolute bottom-3 right-3 text-[10px] font-black uppercase tracking-wider ${isActive ? "text-primary" : "text-base-content/60"}`}>
                
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
