import React from "react";
import { DAILY_QUESTS, WEEKLY_QUESTS, Quest, RequestItem } from "@/data/battlePassQuestData";
import { CalculationResult, LevelData } from "../types";

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
  setCompletedDailyQuests: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  completedWeeklyQuests: Record<string, boolean>;
  setCompletedWeeklyQuests: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isLastDayDailyDone: boolean;
  handleLastDayDailyChange: (checked: boolean) => void;
  isLastDayDailyQuests: Record<string, boolean>;
  setIsLastDayDailyQuests: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isLastDayWeeklyDone: boolean;
  handleLastDayWeeklyChange: (checked: boolean) => void;
  isLastDayWeeklyQuests: Record<string, boolean>;
  setIsLastDayWeeklyQuests: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isDailyCompleted: boolean;
  handleDailyCompletedChange: (checked: boolean) => void;
  completedDailyQuestsList: Record<string, boolean>;
  setCompletedDailyQuestsList: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isWeeklyCompleted: boolean;
  handleWeeklyCompletedChange: (checked: boolean) => void;
  completedWeeklyQuestsList: Record<string, boolean>;
  setCompletedWeeklyQuestsList: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  projectedLevelData: LevelData;
  calculation: CalculationResult;
  formatRequest: (request: RequestItem[] | undefined) => string;
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
}: CurrentStatusSectionProps) {
  return (
    <div className="card w-full border border-indigo-200/80 bg-linear-to-br from-indigo-50/95 via-sky-50/95 to-indigo-100/95 shadow-2xl shadow-indigo-200/40 backdrop-blur-sm">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-indigo-900 sm:text-2xl">
          <span className="text-2xl">📊</span> Status ปัจจุบัน
        </h2>

        <div className="mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-gray-700 text-sm sm:text-base">แต้มปัจจุบัน (รวม)</span>
            </label>
            <input
              type="text"
              value={totalPoints}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTotalPoints(value ? parseInt(value, 10) : 0);
              }}
              placeholder="0"
              className="input input-bordered input-lg w-full bg-white focus:input-primary border-indigo-300 text-2xl sm:text-3xl font-bold text-center text-indigo-600"
            />
            <label className="label">
              <span className="label-text-alt text-gray-500 text-xs">กรอกแต้มรวมปัจจุบัน</span>
            </label>
            <div className="mt-3 bg-indigo-100 rounded-lg p-4 border border-indigo-300">
              <div className="text-center">
                <div className="text-xs text-indigo-700 font-semibold mb-1">Level ปัจจุบัน</div>
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600">{currentLevel}</div>
                <div className="text-xs text-indigo-600 mt-1">{currentPoints}/{maxExpForLevel} แต้ม</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-indigo-200">
          <div className="text-xs font-bold text-indigo-900 mb-4">⚙️ Options & Filter</div>
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="text-xs font-bold text-yellow-900 mb-3 flex items-center gap-2">
                <span>💛</span> Account Type
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
                  <input
                    type="radio"
                    name="account-type"
                    checked={!isPremiumOpened}
                    onChange={() => setIsPremiumOpened(false)}
                    className="radio radio-primary"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">⚪ Normal Pass</div>
                    <div className="text-xs text-gray-500">รับแต้ม Daily แบบปกติ</div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3 shadow-sm transition hover:border-amber-300">
                  <input
                    type="radio"
                    name="account-type"
                    checked={isPremiumOpened}
                    onChange={() => setIsPremiumOpened(true)}
                    className="radio radio-warning"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">💛 Premium Pass</div>
                    <div className="text-xs text-gray-500">ได้เพิ่ม +10 แต้ม/วัน</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span>✅</span> Daily Quest Progress
              </div>
              <div className="space-y-2">
                {isPremiumOpened ? (
                  <>
                    {activePremiumDailyQuest ? (
                      <div className="form-control">
                        <label className="label cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            checked={completedDailyQuests[activePremiumDailyQuest.name] || false}
                            onChange={(e) =>
                              setCompletedDailyQuests({
                                ...completedDailyQuests,
                                [activePremiumDailyQuest.name]: e.target.checked,
                              })
                            }
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text text-gray-700 font-medium">
                            {activePremiumDailyQuest.name} ({formatRequest(activePremiumDailyQuest.request)}) {activePremiumDailyQuest.reward} แต้ม
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No active premium quest</div>
                    )}

                    <div className="form-control">
                      <label className="label cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          checked={completedDailyQuests["Send Zeny"] || false}
                          onChange={(e) =>
                            setCompletedDailyQuests({
                              ...completedDailyQuests,
                              "Send Zeny": e.target.checked,
                            })
                          }
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text text-gray-700 font-medium">
                          Send Zeny ({formatRequest(DAILY_QUESTS[1].request)}) {DAILY_QUESTS[1].reward} แต้ม
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  DAILY_QUESTS.map((quest) => (
                    <div key={quest.name} className="form-control">
                      <label className="label cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          checked={completedDailyQuests[quest.name] || false}
                          onChange={(e) =>
                            setCompletedDailyQuests({
                              ...completedDailyQuests,
                              [quest.name]: e.target.checked,
                            })
                          }
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text text-gray-700 font-medium">
                          {quest.name} ({formatRequest(quest.request)}) {quest.reward} แต้ม
                        </span>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="text-xs font-bold text-purple-900 mb-3 flex items-center gap-2">
                <span>🐉</span> Weekly Quest Progress
              </div>
              <div className="space-y-2">
                {WEEKLY_QUESTS.map((quest) => (
                  <div key={quest.name} className="form-control">
                    <label className="label cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={completedWeeklyQuests[quest.name] || false}
                        onChange={(e) =>
                          setCompletedWeeklyQuests({
                            ...completedWeeklyQuests,
                            [quest.name]: e.target.checked,
                          })
                        }
                        className="checkbox checkbox-warning"
                      />
                      <span className="label-text text-gray-700 font-medium">
                        {quest.name} ({formatRequest(quest.request)}) {quest.reward} แต้ม
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="text-xs font-bold text-orange-900 mb-3 flex items-center gap-2">
                <span>⏰</span> Last Day Bonus (24 มิถุนายน)
              </div>
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={isLastDayDailyDone}
                      onChange={(e) => handleLastDayDailyChange(e.target.checked)}
                      className="checkbox checkbox-info"
                    />
                    <span className="label-text text-gray-700 font-medium">ทำ Daily ในวันสุดท้าย</span>
                  </label>
                  {isLastDayDailyDone && (
                    <div className="ml-8 mt-2 p-2 bg-white rounded border border-orange-200 text-xs text-gray-600 space-y-1">
                      <div className="font-semibold text-orange-900 mb-2">เลือก quest ที่จะทำ:</div>
                      {isPremiumOpened ? (
                        activePremiumDailyQuest ? (
                          <div className="form-control">
                            <label className="label cursor-pointer gap-2 p-1">
                              <input
                                type="checkbox"
                                checked={isLastDayDailyQuests[activePremiumDailyQuest.name] || false}
                                onChange={(e) =>
                                  setIsLastDayDailyQuests({
                                    ...isLastDayDailyQuests,
                                    [activePremiumDailyQuest.name]: e.target.checked,
                                  })
                                }
                                className="checkbox checkbox-xs"
                              />
                              <span className="label-text text-xs">{activePremiumDailyQuest.name} ({formatRequest(activePremiumDailyQuest.request)}) • {activePremiumDailyQuest.reward} แต้ม</span>
                            </label>
                          </div>
                        ) : null
                      ) : (
                        DAILY_QUESTS.map((quest) => (
                          <div key={quest.name} className="form-control">
                            <label className="label cursor-pointer gap-2 p-1">
                              <input
                                type="checkbox"
                                checked={isLastDayDailyQuests[quest.name] || false}
                                onChange={(e) =>
                                  setIsLastDayDailyQuests({
                                    ...isLastDayDailyQuests,
                                    [quest.name]: e.target.checked,
                                  })
                                }
                                className="checkbox checkbox-xs"
                              />
                              <span className="label-text text-xs">{quest.name} ({formatRequest(quest.request)}) • {quest.reward} แต้ม</span>
                            </label>
                          </div>
                        ))
                      )}
                      {isPremiumOpened && activePremiumDailyQuest && (
                        <div className="form-control">
                          <label className="label cursor-pointer gap-2 p-1">
                            <input
                              type="checkbox"
                              checked={isLastDayDailyQuests["Send Zeny"] || false}
                              onChange={(e) =>
                                setIsLastDayDailyQuests({
                                  ...isLastDayDailyQuests,
                                  "Send Zeny": e.target.checked,
                                })
                              }
                              className="checkbox checkbox-xs"
                            />
                            <span className="label-text text-xs">Send Zeny ({formatRequest(DAILY_QUESTS[1].request)}) • {DAILY_QUESTS[1].reward} แต้ม</span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={isLastDayWeeklyDone}
                      onChange={(e) => handleLastDayWeeklyChange(e.target.checked)}
                      className="checkbox checkbox-info"
                    />
                    <span className="label-text text-gray-700 font-medium">ทำ Weekly ในวันสุดท้าย</span>
                  </label>
                  {isLastDayWeeklyDone && (
                    <div className="ml-8 mt-2 p-2 bg-white rounded border border-orange-200 text-xs text-gray-600 space-y-1">
                      <div className="font-semibold text-orange-900 mb-2">เลือก quest ที่จะทำ:</div>
                      {WEEKLY_QUESTS.map((quest) => (
                        <div key={quest.name} className="form-control">
                          <label className="label cursor-pointer gap-2 p-1">
                            <input
                              type="checkbox"
                              checked={isLastDayWeeklyQuests[quest.name] || false}
                              onChange={(e) =>
                                setIsLastDayWeeklyQuests({
                                  ...isLastDayWeeklyQuests,
                                  [quest.name]: e.target.checked,
                                })
                              }
                              className="checkbox checkbox-xs"
                            />
                            <span className="label-text text-xs">{quest.name} ({formatRequest(quest.request)}) • {quest.reward} แต้ม</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="text-xs font-bold text-green-900 mb-3 flex items-center gap-2">
                <span>✅</span> Quest ที่ทำสำเร็จแล้ว
              </div>
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={isDailyCompleted}
                      onChange={(e) => handleDailyCompletedChange(e.target.checked)}
                      className="checkbox checkbox-success"
                    />
                    <span className="label-text text-gray-700 font-medium">Daily completed</span>
                  </label>
                  {isDailyCompleted && (
                    <div className="ml-8 mt-2 p-2 bg-white rounded border border-green-200 text-xs text-gray-600 space-y-1">
                      <div className="font-semibold text-green-900 mb-2">เลือก quest ที่ทำไปแล้ว:</div>
                      {isPremiumOpened ? (
                        activePremiumDailyQuest ? (
                          <div className="form-control">
                            <label className="label cursor-pointer gap-2 p-1">
                              <input
                                type="checkbox"
                                checked={completedDailyQuestsList[activePremiumDailyQuest.name] || false}
                                onChange={(e) =>
                                  setCompletedDailyQuestsList({
                                    ...completedDailyQuestsList,
                                    [activePremiumDailyQuest.name]: e.target.checked,
                                  })
                                }
                                className="checkbox checkbox-xs"
                              />
                              <span className="label-text text-xs">{activePremiumDailyQuest.name} • {activePremiumDailyQuest.reward} แต้ม</span>
                            </label>
                          </div>
                        ) : null
                      ) : (
                        DAILY_QUESTS.map((quest) => (
                          <div key={quest.name} className="form-control">
                            <label className="label cursor-pointer gap-2 p-1">
                              <input
                                type="checkbox"
                                checked={completedDailyQuestsList[quest.name] || false}
                                onChange={(e) =>
                                  setCompletedDailyQuestsList({
                                    ...completedDailyQuestsList,
                                    [quest.name]: e.target.checked,
                                  })
                                }
                                className="checkbox checkbox-xs"
                              />
                              <span className="label-text text-xs">{quest.name} • {quest.reward} แต้ม</span>
                            </label>
                          </div>
                        ))
                      )}
                      {isPremiumOpened && activePremiumDailyQuest && (
                        <div className="form-control">
                          <label className="label cursor-pointer gap-2 p-1">
                            <input
                              type="checkbox"
                              checked={completedDailyQuestsList["Send Zeny"] || false}
                              onChange={(e) =>
                                setCompletedDailyQuestsList({
                                  ...completedDailyQuestsList,
                                  "Send Zeny": e.target.checked,
                                })
                              }
                              className="checkbox checkbox-xs"
                            />
                            <span className="label-text text-xs">Send Zeny • {DAILY_QUESTS[1].reward} แต้ม</span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={isWeeklyCompleted}
                      onChange={(e) => handleWeeklyCompletedChange(e.target.checked)}
                      className="checkbox checkbox-success"
                    />
                    <span className="label-text text-gray-700 font-medium">Weekly completed</span>
                  </label>
                  {isWeeklyCompleted && (
                    <div className="ml-8 mt-2 p-2 bg-white rounded border border-green-200 text-xs text-gray-600 space-y-1">
                      <div className="font-semibold text-green-900 mb-2">เลือก quest ที่ทำไปแล้ว:</div>
                      {WEEKLY_QUESTS.map((quest) => (
                        <div key={quest.name} className="form-control">
                          <label className="label cursor-pointer gap-2 p-1">
                            <input
                              type="checkbox"
                              checked={completedWeeklyQuestsList[quest.name] || false}
                              onChange={(e) =>
                                setCompletedWeeklyQuestsList({
                                  ...completedWeeklyQuestsList,
                                  [quest.name]: e.target.checked,
                                })
                              }
                              className="checkbox checkbox-xs"
                            />
                            <span className="label-text text-xs">{quest.name} • {quest.reward} แต้ม</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-indigo-200 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl p-4">
          <div className="text-center">
            <div className="text-sm font-bold text-amber-900 mb-3">จนถึงวันสุดท้าย จะได้ Level ถ้าทำ Daily, Weekly ครบ</div>
            <div className="text-4xl sm:text-5xl font-bold text-amber-600">Level {projectedLevelData.level}</div>

            <div className="text-xs text-amber-900 bg-white bg-opacity-60 rounded p-3 mt-2 space-y-1">
              <div className="font-bold mb-2">📊 การคำนวน:</div>
              <div>• แต้มปัจจุบัน: {totalPoints}</div>

              {(() => {
                let originalDailyPoints = 0;
                if (completedDailyQuests["Monster Hunt"]) {
                  originalDailyPoints += isPremiumOpened ? 20 : 10;
                }
                if (completedDailyQuests["Send Zeny"]) {
                  originalDailyPoints += 30;
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
                  if (isLastDayDailyQuests["Send Zeny"] && isPremiumOpened && activePremiumDailyQuest) {
                    lastDayDailyPoints += DAILY_QUESTS[1].reward;
                  }
                }

                let completionDailyPoints = 0;
                if (isDailyCompleted) {
                  if (isPremiumOpened && activePremiumDailyQuest) {
                    if (completedDailyQuestsList[activePremiumDailyQuest.name]) {
                      completionDailyPoints += activePremiumDailyQuest.reward;
                    }
                  } else {
                    DAILY_QUESTS.forEach((quest) => {
                      if (completedDailyQuestsList[quest.name]) {
                        completionDailyPoints += quest.reward;
                      }
                    });
                  }
                  if (completedDailyQuestsList["Send Zeny"] && isPremiumOpened && activePremiumDailyQuest) {
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

                let totalAdditional = 0;

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
                        • Daily: {daysForDailyCalc} วัน × {originalDailyPoints} = {daysForDailyCalc * originalDailyPoints}
                      </div>
                    )}

                    {isDailyCompleted && completionDailyPoints > 0 && (
                      <div className="text-red-600 font-semibold">• Quest Completion Daily: - {completionDailyPoints}</div>
                    )}

                    {originalWeeklyPoints > 0 && (
                      <div>
                        • Weekly: {weeksForCalc} สัปดาห์ × {originalWeeklyPoints} = {weeksForCalc * originalWeeklyPoints}
                      </div>
                    )}

                    {isWeeklyCompleted && completionWeeklyPoints > 0 && (
                      <div className="text-red-600 font-semibold">• Quest Completion Weekly: - {completionWeeklyPoints}</div>
                    )}

                    {isLastDayDailyDone && lastDayDailyPoints > 0 && (
                      <div className="text-yellow-600 font-semibold">• Last Day Daily: + {lastDayDailyPoints}</div>
                    )}

                    {isLastDayWeeklyDone && lastDayWeeklyPoints > 0 && (
                      <div className="text-yellow-600 font-semibold">• Last Day Weekly: + {lastDayWeeklyPoints}</div>
                    )}

                    <div className="font-bold mt-2 text-amber-900 pt-2 border-t border-amber-200">
                      รวม: {totalPoints} + {totalAdditional} = {totalPoints + totalAdditional} แต้ม
                    </div>
                  </>
                );
              })()}

              {isPremiumOpened && <div className="text-yellow-700 font-bold mt-2">💛 Premium Pass</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
