import React from "react";
import { CalendarDays, CalendarRange, Trophy } from "lucide-react";
import {
  DAILY_QUESTS,
  WEEKLY_QUESTS,
  SEASON_QUESTS,
  Quest,
  RequestItem,
} from "@/data/battlePassQuestData";
import { CalculationResult, LevelData } from "../types";
import QuestTicket from "./QuestTicket";
import CollapsibleQuestTicket from "./CollapsibleQuestTicket";

interface CurrentStatusSectionProps {
  totalPoints: number;
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
  currentLevel: number;
  currentPoints: number;
  maxExpForLevel: number;
  isPremiumOpened: boolean;
  setIsPremiumOpened: React.Dispatch<React.SetStateAction<boolean>>;
  activePremiumDailyQuest: Quest | null;
  completedDailyQuests: Record<string, boolean>;
  setCompletedDailyQuests: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  completedWeeklyQuests: Record<string, boolean>;
  setCompletedWeeklyQuests: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  isLastDayDailyDone: boolean;
  handleLastDayDailyChange: (checked: boolean) => void;
  isLastDayDailyQuests: Record<string, boolean>;
  setIsLastDayDailyQuests: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  isLastDayWeeklyDone: boolean;
  handleLastDayWeeklyChange: (checked: boolean) => void;
  isLastDayWeeklyQuests: Record<string, boolean>;
  setIsLastDayWeeklyQuests: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  isDailyCompleted: boolean;
  handleDailyCompletedChange: (checked: boolean) => void;
  completedDailyQuestsList: Record<string, boolean>;
  setCompletedDailyQuestsList: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  isWeeklyCompleted: boolean;
  handleWeeklyCompletedChange: (checked: boolean) => void;
  completedWeeklyQuestsList: Record<string, boolean>;
  setCompletedWeeklyQuestsList: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  projectedLevelData: LevelData;
  calculation: CalculationResult;
  formatRequest: (request: RequestItem[] | undefined) => string;
  seasonQuests: Record<string, boolean>;
  setSeasonQuests: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  completedSeasonQuestsList: Record<string, boolean>;
  setCompletedSeasonQuestsList: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export default function CurrentStatusSection({
  totalPoints,
  setTotalPoints,
  currentLevel,
  currentPoints,
  maxExpForLevel,
  isPremiumOpened,
  setIsPremiumOpened,
  activePremiumDailyQuest,
  completedDailyQuests,
  setCompletedDailyQuests,
  completedWeeklyQuests,
  setCompletedWeeklyQuests,
  isLastDayDailyDone,
  handleLastDayDailyChange,
  isLastDayDailyQuests,
  setIsLastDayDailyQuests,
  isLastDayWeeklyDone,
  handleLastDayWeeklyChange,
  isLastDayWeeklyQuests,
  setIsLastDayWeeklyQuests,
  isDailyCompleted,
  handleDailyCompletedChange,
  completedDailyQuestsList,
  setCompletedDailyQuestsList,
  isWeeklyCompleted,
  handleWeeklyCompletedChange,
  completedWeeklyQuestsList,
  setCompletedWeeklyQuestsList,
  projectedLevelData,
  calculation,
  formatRequest,
  seasonQuests,
  setSeasonQuests,
  completedSeasonQuestsList,
  setCompletedSeasonQuestsList,
}: CurrentStatusSectionProps) {
  return (
    <div className="card w-full border border-base-300 bg-base-100 text-base-content shadow-md">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-base-content sm:text-2xl">
          <span className="text-2xl">📊</span> Status ปัจจุบัน
        </h2>

        <div className="mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-base-content/80 text-sm sm:text-base">
                แต้มปัจจุบัน (รวม)
              </span>
            </label>
            <input
              type="text"
              value={totalPoints}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTotalPoints(value ? parseInt(value, 10) : 0);
              }}
              placeholder="0"
              className="input input-bordered input-lg w-full border-primary/40 bg-base-100 text-2xl text-center font-bold text-primary focus:input-primary sm:text-3xl"
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60 text-xs">
                กรอกแต้มรวมปัจจุบัน
              </span>
            </label>
            <div className="mt-3 rounded-lg border border-base-300 bg-base-200 p-4">
              <div className="text-center">
                <div className="mb-1 text-xs font-semibold text-primary">
                  Level ปัจจุบัน
                </div>
                <div className="text-3xl font-bold text-base-content sm:text-4xl">
                  {currentLevel}
                </div>
                <div className="mt-1 text-xs text-primary">
                  {currentPoints}/{maxExpForLevel} แต้ม
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Scroll BP */}
        <div className="mt-6 rounded-xl border-t border-base-300 bg-base-200 p-4 pt-6">
          <div className="text-center">
            <div className="mb-3 text-sm font-bold text-base-content/80">
              จนถึงวันสุดท้าย จะได้ Level ถ้าทำ Daily, Weekly ครบ
            </div>
            <div className="text-4xl font-bold text-base-content sm:text-5xl">
              Level {projectedLevelData.level}
            </div>

            <div className="mt-2 space-y-1 rounded bg-base-100 p-3 text-xs text-base-content/80">
              <div className="font-bold mb-2">📊 การคำนวน:</div>
              <div>• แต้มปัจจุบัน: {totalPoints}</div>

              {(() => {
                let originalDailyPoints = 0;
                if (completedDailyQuests["Monster Hunt"]) {
                  originalDailyPoints +=
                    isPremiumOpened && activePremiumDailyQuest
                      ? activePremiumDailyQuest.reward
                      : DAILY_QUESTS[0].reward;
                }
                if (completedDailyQuests["Send Zeny"]) {
                  originalDailyPoints += DAILY_QUESTS[1].reward;
                }

                let lastDayDailyPoints = 0;
                if (isLastDayDailyDone) {
                  if (isPremiumOpened && activePremiumDailyQuest) {
                    if (isLastDayDailyQuests[activePremiumDailyQuest.name]) {
                      lastDayDailyPoints += activePremiumDailyQuest.reward;
                    }
                  } else {
                    DAILY_QUESTS.forEach((quest) => {
                      if (isLastDayDailyQuests[quest.name]) {
                        lastDayDailyPoints += quest.reward;
                      }
                    });
                  }
                  if (
                    isLastDayDailyQuests["Send Zeny"] &&
                    isPremiumOpened &&
                    activePremiumDailyQuest
                  ) {
                    lastDayDailyPoints += DAILY_QUESTS[1].reward;
                  }
                }

                let completionDailyPoints = 0;
                if (isDailyCompleted) {
                  if (isPremiumOpened && activePremiumDailyQuest) {
                    if (
                      completedDailyQuestsList[activePremiumDailyQuest.name]
                    ) {
                      completionDailyPoints += activePremiumDailyQuest.reward;
                    }
                  } else {
                    DAILY_QUESTS.forEach((quest) => {
                      if (completedDailyQuestsList[quest.name]) {
                        completionDailyPoints += quest.reward;
                      }
                    });
                  }
                  if (
                    completedDailyQuestsList["Send Zeny"] &&
                    isPremiumOpened &&
                    activePremiumDailyQuest
                  ) {
                    completionDailyPoints += DAILY_QUESTS[1].reward;
                  }
                }

                let originalWeeklyPoints = 0;
                WEEKLY_QUESTS.forEach((quest) => {
                  if (completedWeeklyQuests[quest.name]) {
                    originalWeeklyPoints += quest.reward;
                  }
                });

                let lastDayWeeklyPoints = 0;
                if (isLastDayWeeklyDone) {
                  WEEKLY_QUESTS.forEach((quest) => {
                    if (isLastDayWeeklyQuests[quest.name]) {
                      lastDayWeeklyPoints += quest.reward;
                    }
                  });
                }

                let completionWeeklyPoints = 0;
                if (isWeeklyCompleted) {
                  WEEKLY_QUESTS.forEach((quest) => {
                    if (completedWeeklyQuestsList[quest.name]) {
                      completionWeeklyPoints += quest.reward;
                    }
                  });
                }

                const daysForDailyCalc = Math.max(0, calculation.daysRemaining);
                const weeksForCalc = calculation.weeksRemaining;

                let seasonPoints = 0;
                let completedSeasonPoints = 0;
                SEASON_QUESTS.forEach((quest) => {
                  if (!isPremiumOpened) return;
                  if (seasonQuests[quest.name]) {
                    seasonPoints += quest.reward;
                  }
                  if (completedSeasonQuestsList[quest.name]) {
                    completedSeasonPoints += quest.reward;
                  }
                });

                let totalAdditional = 0;

                totalAdditional += seasonPoints - completedSeasonPoints;

                if (originalDailyPoints > 0) {
                  totalAdditional += daysForDailyCalc * originalDailyPoints;
                }
                if (isDailyCompleted && completionDailyPoints > 0) {
                  totalAdditional -= completionDailyPoints;
                }
                if (originalWeeklyPoints > 0) {
                  totalAdditional += weeksForCalc * originalWeeklyPoints;
                }
                if (isWeeklyCompleted && completionWeeklyPoints > 0) {
                  totalAdditional -= completionWeeklyPoints;
                }
                if (isLastDayDailyDone && lastDayDailyPoints > 0) {
                  totalAdditional += lastDayDailyPoints;
                }
                if (isLastDayWeeklyDone && lastDayWeeklyPoints > 0) {
                  totalAdditional += lastDayWeeklyPoints;
                }

                return (
                  <>
                    {originalDailyPoints > 0 && (
                      <div>
                        • Daily: {daysForDailyCalc} วัน × {originalDailyPoints}{" "}
                        = {daysForDailyCalc * originalDailyPoints}
                      </div>
                    )}

                    {isDailyCompleted && completionDailyPoints > 0 && (
                      <div className="font-semibold text-primary">
                        • Quest Completion Daily: - {completionDailyPoints}
                      </div>
                    )}

                    {originalWeeklyPoints > 0 && (
                      <div>
                        • Weekly: {weeksForCalc} สัปดาห์ ×{" "}
                        {originalWeeklyPoints} ={" "}
                        {weeksForCalc * originalWeeklyPoints}
                      </div>
                    )}

                    {isWeeklyCompleted && completionWeeklyPoints > 0 && (
                      <div className="font-semibold text-primary">
                        • Quest Completion Weekly: - {completionWeeklyPoints}
                      </div>
                    )}

                    {seasonPoints > 0 && (
                      <div>• Season Quest: + {seasonPoints}</div>
                    )}

                    {completedSeasonPoints > 0 && (
                      <div className="font-semibold text-primary">
                        • Quest Completion Season: - {completedSeasonPoints}
                      </div>
                    )}

                    {isLastDayDailyDone && lastDayDailyPoints > 0 && (
                      <div className="font-semibold text-primary">
                        • Last Day Daily: + {lastDayDailyPoints}
                      </div>
                    )}

                    {isLastDayWeeklyDone && lastDayWeeklyPoints > 0 && (
                      <div className="font-semibold text-primary">
                        • Last Day Weekly: + {lastDayWeeklyPoints}
                      </div>
                    )}

                    <div className="mt-2 border-t border-base-300 pt-2 font-bold text-base-content">
                      รวม: {totalPoints} + {totalAdditional} ={" "}
                      {totalPoints + totalAdditional} แต้ม
                    </div>
                  </>
                );
              })()}

              {isPremiumOpened && (
                <div className="mt-2 font-bold text-primary">Premium Pass</div>
              )}
            </div>
          </div>
        </div>

        {/* filter Battle Pass */}

        <div className="mb-6 border-b border-base-300 pb-6">
          <div className="space-y-4">
            <div className="rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label
                  className={`group relative flex min-h-28 cursor-pointer overflow-hidden rounded-2xl border-2 bg-base-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${!isPremiumOpened ? "scale-[1.02] border-4 border-primary bg-base-100 shadow-xl ring-4 ring-base-300" : "border-base-300 opacity-75"}`}
                >
                  <input
                    type="radio"
                    name="account-type"
                    checked={!isPremiumOpened}
                    onChange={() => setIsPremiumOpened(false)}
                    className="sr-only"
                  />
                  <span className="flex w-14 shrink-0 items-center justify-center border-r-2 border-dashed border-base-300 bg-base-300 text-2xl text-base-content/80">
                    N
                  </span>
                  <span className="flex flex-1 flex-col justify-center px-4 py-3">
                    <span className="text-[15px] font-bold uppercase tracking-[0.18em] text-base-content ">
                      Normal Battle Pass
                    </span>
                    <span className="mt-1 text-xs text-base-content/60">
                      รับแต้ม Daily แบบปกติ
                    </span>
                    <span className="text-error">Level สูงสุดที่ 100</span>
                  </span>
                  <span
                    className={`absolute right-3 top-3 h-3 w-3 rounded-full ring-2 ring-base-100 ${!isPremiumOpened ? "bg-primary" : "bg-base-300"}`}
                  />
                </label>

                <label
                  className={`group relative flex min-h-28 cursor-pointer overflow-hidden rounded-2xl border-2 bg-accent/10 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isPremiumOpened ? "scale-[1.02] border-4 border-accent bg-accent/20 shadow-xl ring-4 ring-accent/30" : "border-accent/40 opacity-75"}`}
                >
                  <input
                    type="radio"
                    name="account-type"
                    checked={isPremiumOpened}
                    onChange={() => setIsPremiumOpened(true)}
                    className="sr-only"
                  />
                  <span className="flex w-14 shrink-0 items-center justify-center border-r-2 border-dashed border-accent/40 bg-accent/20 text-2xl font-black text-base-content">
                    P
                  </span>
                  <span className="flex flex-1 flex-col justify-center px-4 py-3">
                    <span className="text-[15px] font-bold uppercase tracking-[0.18em] text-base-content/70">
                      Premium Pass
                    </span>
                    <span className="mt-1 text-xs text-base-content/60">
                      ได้เพิ่ม +10 แต้ม/วัน
                    </span>
                  </span>
                  <span
                    className={`absolute right-3 top-3 h-3 w-3 rounded-full ring-2 ring-base-100 ${isPremiumOpened ? "bg-accent" : "bg-accent/40"}`}
                  />
                </label>
              </div>
            </div>
            {/* filter Tab */}

            <div className="tabs tabs-boxed tabs-lg w-full gap-1 overflow-x-auto p-2">
              <input
                type="radio"
                name="quest-tabs"
                className="tab min-w-32 shrink-0 flex-1 whitespace-nowrap text-primary checked:bg-primary checked:text-primary-content checked:shadow-lg checked:border checked:border-b-2 checked:border-primary/20 rounded-2xl"
                aria-label="Quest"
                defaultChecked
              />
              <div className="tab-content rounded-box p-4">
                <div className="rounded-xl border border-primary/20  p-4">
                  <div className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
                    <CalendarDays
                      aria-hidden="true"
                      className="h-10 w-10 text-primary"
                    />{" "}
                    เควสประจำวัน
                  </div>
                  {isPremiumOpened && !activePremiumDailyQuest ? (
                    <div className="text-sm text-base-content/60">
                      No active premium quest
                    </div>
                  ) : (
                    <QuestTicket
                      quests={
                        isPremiumOpened && activePremiumDailyQuest
                          ? [activePremiumDailyQuest, DAILY_QUESTS[1]]
                          : DAILY_QUESTS
                      }
                      activeQuests={completedDailyQuests}
                      setActiveQuests={setCompletedDailyQuests}
                      formatRequest={formatRequest}
                    />
                  )}
                </div>
                <div className="rounded-xl border border-primary/20 p-4">
                  <div className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
                    <CalendarRange
                      aria-hidden="true"
                      className="h-10 w-10 text-primary"
                    />{" "}
                    เควสประจำสัปดาห์
                  </div>
                  <QuestTicket
                    quests={WEEKLY_QUESTS}
                    activeQuests={completedWeeklyQuests}
                    setActiveQuests={setCompletedWeeklyQuests}
                    formatRequest={formatRequest}
                  />
                </div>
                {isPremiumOpened && (
                  <div className="rounded-xl border border-primary/20 p-4">
                    <div className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
                      <Trophy
                        aria-hidden="true"
                        className="h-10 w-10 text-primary"
                      />{" "}
                      เควส Season (Premium เท่านั้น • ครั้งเดียว)
                    </div>
                    <QuestTicket
                      quests={SEASON_QUESTS}
                      activeQuests={seasonQuests}
                      setActiveQuests={setSeasonQuests}
                      formatRequest={formatRequest}
                    />
                  </div>
                )}
              </div>

              <input
                type="radio"
                name="quest-tabs"
                className="tab min-w-32 shrink-0 flex-1 whitespace-nowrap text-primary checked:bg-primary checked:text-primary-content checked:shadow-lg checked:border checked:border-b-2 checked:border-primary/20 rounded-2xl"
                aria-label="Complete Quest"
              />
              <div className="tab-content rounded-box border-primary/20 bg-base-200 p-4">
                <div className="rounded-2xl border border-dashed border-primary/40 bg-base-200 p-3">
                  <div className="mb-3 flex items-center gap-3 px-2">
                    <span className="h-px flex-1 bg-primary" />
                    <span className="text-lg font-black uppercase tracking-[0.18em] text-primary text-center">
                      Completion Section <br />
                      <span className="text-sm text-error">
                        (ถ้าหากแต้มที่กรอกมาทำเควสสำเร็จแล้ว)
                      </span>
                    </span>
                    <span className="h-px flex-1 bg-primary" />
                  </div>
                  <div className="rounded-xl border border-base-300 bg-base-200 p-4">
                    <div className="space-y-3">
                      <div className="form-control">
                        <label className="hidden label cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            checked={isDailyCompleted}
                            onChange={(e) =>
                              handleDailyCompletedChange(e.target.checked)
                            }
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text text-base-content font-medium">
                            Daily completed
                          </span>
                        </label>
                        {true && (
                          <>
                            <CollapsibleQuestTicket
                              title="เลือก Daily Quest ที่ทำสำเร็จแล้ว"
                              quests={
                                isPremiumOpened && activePremiumDailyQuest
                                  ? [activePremiumDailyQuest, DAILY_QUESTS[1]]
                                  : DAILY_QUESTS
                              }
                              activeQuests={completedDailyQuestsList}
                              setActiveQuests={setCompletedDailyQuestsList}
                              formatRequest={formatRequest}
                              onActiveSumChange={(sum) =>
                                handleDailyCompletedChange(sum > 0)
                              }
                            />
                            {false && activePremiumDailyQuest && (
                              <div className="ml-8 mt-2 space-y-1 rounded border border-primary/20 bg-base-100 p-2 text-xs text-base-content/70">
                                <div className="mb-2 font-semibold text-primary">
                                  เลือก quest ที่ทำไปแล้ว:
                                </div>
                                {isPremiumOpened ? (
                                  activePremiumDailyQuest ? (
                                    <div className="form-control">
                                      <label className="label cursor-pointer gap-2 p-1">
                                        <input
                                          type="checkbox"
                                          checked={
                                            completedDailyQuestsList[
                                              activePremiumDailyQuest!.name
                                            ] || false
                                          }
                                          onChange={(e) =>
                                            setCompletedDailyQuestsList({
                                              ...completedDailyQuestsList,
                                              [activePremiumDailyQuest!.name]:
                                                e.target.checked,
                                            })
                                          }
                                          className="checkbox checkbox-xs"
                                        />
                                        <span className="label-text text-xs">
                                          {activePremiumDailyQuest!.name} •{" "}
                                          {activePremiumDailyQuest!.reward} แต้ม
                                        </span>
                                      </label>
                                    </div>
                                  ) : null
                                ) : (
                                  DAILY_QUESTS.map((quest) => (
                                    <div
                                      key={quest.name}
                                      className="form-control"
                                    >
                                      <label className="label cursor-pointer gap-2 p-1">
                                        <input
                                          type="checkbox"
                                          checked={
                                            completedDailyQuestsList[
                                              quest.name
                                            ] || false
                                          }
                                          onChange={(e) =>
                                            setCompletedDailyQuestsList({
                                              ...completedDailyQuestsList,
                                              [quest.name]: e.target.checked,
                                            })
                                          }
                                          className="checkbox checkbox-xs"
                                        />
                                        <span className="label-text text-xs">
                                          {quest.name} • {quest.reward} แต้ม
                                        </span>
                                      </label>
                                    </div>
                                  ))
                                )}
                                {isPremiumOpened && activePremiumDailyQuest && (
                                  <div className="form-control">
                                    <label className="label cursor-pointer gap-2 p-1">
                                      <input
                                        type="checkbox"
                                        checked={
                                          completedDailyQuestsList[
                                            "Send Zeny"
                                          ] || false
                                        }
                                        onChange={(e) =>
                                          setCompletedDailyQuestsList({
                                            ...completedDailyQuestsList,
                                            "Send Zeny": e.target.checked,
                                          })
                                        }
                                        className="checkbox checkbox-xs"
                                      />
                                      <span className="label-text text-xs">
                                        Send Zeny • {DAILY_QUESTS[1].reward}{" "}
                                        แต้ม
                                      </span>
                                    </label>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="hidden label cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            checked={isWeeklyCompleted}
                            onChange={(e) =>
                              handleWeeklyCompletedChange(e.target.checked)
                            }
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text text-base-content font-medium">
                            Weekly completed
                          </span>
                        </label>
                        {true && (
                          <>
                            <CollapsibleQuestTicket
                              title="เลือก Weekly Quest ที่ทำสำเร็จแล้ว"
                              quests={WEEKLY_QUESTS}
                              activeQuests={completedWeeklyQuestsList}
                              setActiveQuests={setCompletedWeeklyQuestsList}
                              formatRequest={formatRequest}
                              onActiveSumChange={(sum) =>
                                handleWeeklyCompletedChange(sum > 0)
                              }
                            />
                            {false && activePremiumDailyQuest && (
                              <div className="ml-8 mt-2 space-y-1 rounded border border-primary/20 bg-base-100 p-2 text-xs text-base-content/70">
                                <div className="mb-2 font-semibold text-primary">
                                  เลือก quest ที่ทำไปแล้ว:
                                </div>
                                {WEEKLY_QUESTS.map((quest) => (
                                  <div
                                    key={quest.name}
                                    className="form-control"
                                  >
                                    <label className="label cursor-pointer gap-2 p-1">
                                      <input
                                        type="checkbox"
                                        checked={
                                          completedWeeklyQuestsList[
                                            quest.name
                                          ] || false
                                        }
                                        onChange={(e) =>
                                          setCompletedWeeklyQuestsList({
                                            ...completedWeeklyQuestsList,
                                            [quest.name]: e.target.checked,
                                          })
                                        }
                                        className="checkbox checkbox-xs"
                                      />
                                      <span className="label-text text-xs">
                                        {quest.name} • {quest.reward} แต้ม
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {isPremiumOpened && (
                        <div className="form-control">
                          <CollapsibleQuestTicket
                            title="เลือก Season Quest ที่ทำสำเร็จแล้ว"
                            quests={SEASON_QUESTS}
                            activeQuests={completedSeasonQuestsList}
                            setActiveQuests={setCompletedSeasonQuestsList}
                            formatRequest={formatRequest}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <input
                type="radio"
                name="quest-tabs"
                className="tab min-w-32 shrink-0 flex-1 whitespace-nowrap text-primary checked:bg-primary checked:text-primary-content checked:shadow-lg checked:border checked:border-b-2 checked:border-primary/20 rounded-2xl"
                aria-label="Bonus (วันสุดท้าย)"
              />
              <div className="tab-content rounded-box border-primary/20 bg-base-200 p-4">
                <div className="rounded-2xl border border-dashed border-primary/40 bg-base-200 p-3">
                  <div className="mb-3 flex items-center gap-3 px-2">
                    <span className="h-px flex-1 bg-primary" />
                    <span className="text-lg font-black uppercase tracking-[0.18em] text-primary text-center">
                      Bonus Section
                      <br />
                      <span className="text-sm text-error">
                        {" "}
                        (กรณีทำวันสุดท้าย ตี 4 )
                      </span>
                    </span>
                    <span className="h-px flex-1 bg-primary" />
                  </div>
                  <div className="rounded-xl border border-base-300 bg-base-200 p-4">
                    <div className="space-y-3">
                      <div className="form-control">
                        <label className="hidden label cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            checked={isLastDayDailyDone}
                            onChange={(e) =>
                              handleLastDayDailyChange(e.target.checked)
                            }
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text text-base-content font-medium">
                            ทำ Daily ในวันสุดท้าย
                          </span>
                        </label>
                        {true && (
                          <>
                            <CollapsibleQuestTicket
                              title="เลือก Daily Quest สำหรับวันสุดท้าย"
                              quests={
                                isPremiumOpened && activePremiumDailyQuest
                                  ? [activePremiumDailyQuest, DAILY_QUESTS[1]]
                                  : DAILY_QUESTS
                              }
                              activeQuests={isLastDayDailyQuests}
                              setActiveQuests={setIsLastDayDailyQuests}
                              formatRequest={formatRequest}
                              onActiveSumChange={(sum) =>
                                handleLastDayDailyChange(sum > 0)
                              }
                            />
                            {false && activePremiumDailyQuest && (
                              <div className="ml-8 mt-2 space-y-1 rounded border border-primary/20 bg-base-100 p-2 text-xs text-base-content/70">
                                <div className="mb-2 font-semibold text-primary">
                                  เลือก quest ที่จะทำ:
                                </div>
                                {isPremiumOpened ? (
                                  activePremiumDailyQuest ? (
                                    <div className="form-control">
                                      <label className="label cursor-pointer gap-2 p-1">
                                        <input
                                          type="checkbox"
                                          checked={
                                            isLastDayDailyQuests[
                                              activePremiumDailyQuest!.name
                                            ] || false
                                          }
                                          onChange={(e) =>
                                            setIsLastDayDailyQuests({
                                              ...isLastDayDailyQuests,
                                              [activePremiumDailyQuest!.name]:
                                                e.target.checked,
                                            })
                                          }
                                          className="checkbox checkbox-xs"
                                        />
                                        <span className="label-text text-xs">
                                          {activePremiumDailyQuest!.name} (
                                          {formatRequest(
                                            activePremiumDailyQuest!.request,
                                          )}
                                          ) • {activePremiumDailyQuest!.reward}{" "}
                                          แต้ม
                                        </span>
                                      </label>
                                    </div>
                                  ) : null
                                ) : (
                                  DAILY_QUESTS.map((quest) => (
                                    <div
                                      key={quest.name}
                                      className="form-control"
                                    >
                                      <label className="label cursor-pointer gap-2 p-1">
                                        <input
                                          type="checkbox"
                                          checked={
                                            isLastDayDailyQuests[quest.name] ||
                                            false
                                          }
                                          onChange={(e) =>
                                            setIsLastDayDailyQuests({
                                              ...isLastDayDailyQuests,
                                              [quest.name]: e.target.checked,
                                            })
                                          }
                                          className="checkbox checkbox-xs"
                                        />
                                        <span className="label-text text-xs">
                                          {quest.name} (
                                          {formatRequest(quest.request)}) •{" "}
                                          {quest.reward} แต้ม
                                        </span>
                                      </label>
                                    </div>
                                  ))
                                )}
                                {isPremiumOpened && activePremiumDailyQuest && (
                                  <div className="form-control">
                                    <label className="label cursor-pointer gap-2 p-1">
                                      <input
                                        type="checkbox"
                                        checked={
                                          isLastDayDailyQuests["Send Zeny"] ||
                                          false
                                        }
                                        onChange={(e) =>
                                          setIsLastDayDailyQuests({
                                            ...isLastDayDailyQuests,
                                            "Send Zeny": e.target.checked,
                                          })
                                        }
                                        className="checkbox checkbox-xs"
                                      />
                                      <span className="label-text text-xs">
                                        Send Zeny (
                                        {formatRequest(DAILY_QUESTS[1].request)}
                                        ) • {DAILY_QUESTS[1].reward} แต้ม
                                      </span>
                                    </label>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="hidden label cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            checked={isLastDayWeeklyDone}
                            onChange={(e) =>
                              handleLastDayWeeklyChange(e.target.checked)
                            }
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text text-base-content font-medium">
                            ทำ Weekly ในวันสุดท้าย
                          </span>
                        </label>
                        {true && (
                          <>
                            <CollapsibleQuestTicket
                              title="เลือก Weekly Quest สำหรับวันสุดท้าย"
                              quests={WEEKLY_QUESTS}
                              activeQuests={isLastDayWeeklyQuests}
                              setActiveQuests={setIsLastDayWeeklyQuests}
                              formatRequest={formatRequest}
                              onActiveSumChange={(sum) =>
                                handleLastDayWeeklyChange(sum > 0)
                              }
                            />
                            {false && activePremiumDailyQuest && (
                              <div className="ml-8 mt-2 space-y-1 rounded border border-primary/20 bg-base-100 p-2 text-xs text-base-content/70">
                                {WEEKLY_QUESTS.map((quest) => (
                                  <div
                                    key={quest.name}
                                    className="form-control"
                                  >
                                    <label className="label cursor-pointer gap-2 p-1">
                                      <input
                                        type="checkbox"
                                        checked={
                                          isLastDayWeeklyQuests[quest.name] ||
                                          false
                                        }
                                        onChange={(e) =>
                                          setIsLastDayWeeklyQuests({
                                            ...isLastDayWeeklyQuests,
                                            [quest.name]: e.target.checked,
                                          })
                                        }
                                        className="checkbox checkbox-xs"
                                      />
                                      <span className="label-text text-xs">
                                        {quest.name} (
                                        {formatRequest(quest.request)}) •{" "}
                                        {quest.reward} แต้ม
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
