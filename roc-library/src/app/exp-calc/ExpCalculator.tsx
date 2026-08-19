"use client";

import { useState, useMemo } from "react";
import { EXP_TABLES, ClassType } from "@/data/expTables";

interface ExpRange {
  startLevel: number;
  startPercent: number;
  endLevel: number;
  endPercent: number;
}

export default function ExpCalculator() {
  const [selectedClass, setSelectedClass] = useState<ClassType>("hiClass");
  const [expRange, setExpRange] = useState<ExpRange>({
    startLevel: 1,
    startPercent: 0,
    endLevel: 2,
    endPercent: 0,
  });
  const [startPercentInput, setStartPercentInput] = useState("0");
  const [endPercentInput, setEndPercentInput] = useState("0");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [serverMultiplier, setServerMultiplier] = useState("100");
  const [equipmentExp, setEquipmentExp] = useState("0");
  const [expBuff, setExpBuff] = useState("0");

  const classData = EXP_TABLES[selectedClass];
  const availableLevels = Object.keys(classData.levels)
    .map(Number)
    .sort((a, b) => a - b);

  // Calculate exp needed
  const calculateExpNeeded = useMemo(() => {
    const { startLevel, startPercent, endLevel, endPercent } = expRange;

    if (startLevel > endLevel) return 0;
    if (startLevel === endLevel && startPercent >= endPercent) return 0;

    let totalExp = 0;
    const levels = classData.levels;

    // 1. Remaining exp from start level to next level
    // levels[startLevel+1] = exp needed from startLevel -> startLevel+1
    if (startPercent < 100) {
      const nextLevelExp = levels[startLevel + 1] || 0;
      totalExp += nextLevelExp * ((100 - startPercent) / 100);
    }

    // 2. All complete levels between start and end
    // levels[level+1] = exp needed from level -> level+1
    for (let level = startLevel + 1; level < endLevel; level++) {
      totalExp += levels[level + 1] || 0;
    }

    // 3. Partial exp from end level
    // levels[endLevel+1] = exp needed from endLevel -> endLevel+1
    const endNextLevelExp = levels[endLevel + 1] || 0;
    totalExp += endNextLevelExp * (endPercent / 100);

    return Math.round(totalExp * 100) / 100;
  }, [expRange, classData]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-orange-400 to-red-400 mb-2">
            Exp Calculator
          </h1>
          <p className="text-slate-300">
            Calculate experience needed between levels
          </p>
        </div>

        {/* Main Card */}
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 shadow-2xl">
          <div className="card-body p-6 md:p-8">
            {/* Class Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                เลือกคลาสที่ต้องการคำนวณ
              </label>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(EXP_TABLES) as ClassType[]).map((classKey) => (
                  <button
                    key={classKey}
                    onClick={() => {
                      setSelectedClass(classKey);
                      // Reset levels based on class
                      const classLevels = Object.keys(
                        EXP_TABLES[classKey].levels,
                      ).map(Number);
                      const minLvl = Math.min(...classLevels);
                      setExpRange({
                        startLevel: minLvl,
                        startPercent: 0,
                        endLevel: minLvl + 1,
                        endPercent: 0,
                      });
                      setStartPercentInput("0");
                      setEndPercentInput("0");
                    }}
                    className={`btn btn-sm md:btn-md ${
                      selectedClass === classKey
                        ? "btn-warning text-black font-bold"
                        : "btn-outline btn-warning"
                    }`}
                  >
                    {EXP_TABLES[classKey].name}
                  </button>
                ))}
              </div>
            </div>

            {/* From Section */}
            <div className="divider text-slate-400">From</div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* From Level */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Level
                </label>
                <select
                  value={expRange.startLevel}
                  onChange={(e) => {
                    const newStartLevel = Number(e.target.value);
                    setExpRange((prev) => ({
                      ...prev,
                      startLevel: newStartLevel,
                      endLevel: Math.max(newStartLevel, prev.endLevel),
                    }));
                  }}
                  className="select select-bordered select-warning w-full text-slate-800"
                >
                  {availableLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Level {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* From Percent */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Progress ({expRange.startPercent}%)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={startPercentInput}
                  onChange={(e) => {
                    setStartPercentInput(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    const clamped = Math.min(99.99, Math.max(0, val));
                    setStartPercentInput(clamped.toString());
                    setExpRange((prev) => ({
                      ...prev,
                      startPercent: clamped,
                    }));
                  }}
                  className="input input-bordered input-warning w-full text-slate-800"
                  placeholder="0-99.99"
                />
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center mb-6">
              <div className="text-3xl text-amber-400">↓</div>
            </div>

            {/* To Section */}
            <div className="divider text-slate-400">To</div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* To Level */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Level
                </label>
                <select
                  value={expRange.endLevel}
                  onChange={(e) => {
                    const newEndLevel = Number(e.target.value);
                    setExpRange((prev) => ({
                      ...prev,
                      endLevel: Math.max(prev.startLevel, newEndLevel),
                    }));
                  }}
                  className="select select-bordered select-warning w-full text-slate-800"
                >
                  {availableLevels
                    .filter((lvl) => lvl >= expRange.startLevel)
                    .map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Level {lvl}
                      </option>
                    ))}
                </select>
              </div>

              {/* To Percent */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Progress ({expRange.endPercent}%)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={endPercentInput}
                  onChange={(e) => {
                    setEndPercentInput(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    const clamped = Math.min(99.99, Math.max(0, val));
                    setEndPercentInput(clamped.toString());
                    setExpRange((prev) => ({
                      ...prev,
                      endPercent: clamped,
                    }));
                  }}
                  className="input input-bordered input-warning w-full text-slate-800"
                  placeholder="0-99.99"
                />
              </div>
            </div>

            {/* Time and Multiplier Settings */}
            <div className="divider text-slate-400">Settings</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Hours */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                  ชั่วโมง
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={hours}
                  onChange={(e) => {
                    setHours(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    setHours(val.toString());
                  }}
                  className="input input-bordered input-info w-full text-slate-800 text-sm"
                  placeholder="0"
                />
              </div>

              {/* Minutes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                  นาที
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={minutes}
                  onChange={(e) => {
                    setMinutes(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Math.max(
                      0,
                      Math.min(59, parseInt(e.target.value) || 0),
                    );
                    setMinutes(val.toString());
                  }}
                  className="input input-bordered input-info w-full text-slate-800 text-sm"
                  placeholder="0"
                />
              </div>

              {/* Server Multiplier */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                  Server Exp %
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={serverMultiplier}
                  onChange={(e) => {
                    setServerMultiplier(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 100);
                    setServerMultiplier(val.toString());
                  }}
                  className="input input-bordered input-info w-full text-slate-800 text-sm"
                  placeholder="100"
                />
              </div>

              {/* Equipment Exp % */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                  Equipment Exp %
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={equipmentExp}
                  onChange={(e) => {
                    setEquipmentExp(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    setEquipmentExp(val.toString());
                  }}
                  className="input input-bordered input-info w-full text-slate-800 text-sm"
                  placeholder="0"
                />
              </div>

              {/* Exp Buff % */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                  Exp Buff %
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={expBuff}
                  onChange={(e) => {
                    setExpBuff(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    setExpBuff(val.toString());
                  }}
                  className="input input-bordered input-info w-full text-slate-800 text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 shadow-2xl mt-6">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-2xl font-bold text-amber-400 mb-2">Summary</h2>

            {/* Level Range Summary */}
            <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
              <span className="text-slate-200 font-semibold">
                Lv.{expRange.startLevel}
              </span>
              <span className="text-amber-500/70">
                {expRange.startPercent}%
              </span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-200 font-semibold">
                Lv.{expRange.endLevel}
              </span>
              <span className="text-amber-500/70">{expRange.endPercent}%</span>
            </p>

            {/* Exp and Time Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Exp */}
              <div>
                <p className="text-slate-400 text-sm mb-2">Exp</p>
                <p className="text-4xl font-bold text-amber-400">
                  {calculateExpNeeded.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* Time - Only show if not 0:00 */}
              {(parseInt(hours) > 0 || parseInt(minutes) > 0) && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">เวลาเล่น</p>
                  <p className="text-4xl font-bold text-blue-400">
                    {parseInt(hours)}:
                    {String(parseInt(minutes) || 0).padStart(2, "0")}{" "}
                    <span className="text-lg">hrs</span>
                  </p>
                </div>
              )}
            </div>

            {/* Multipliers Row - Server Exp %, Equipment Exp %, Exp Buff % */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Server Exp % - Only show if not 100 */}
              {parseFloat(serverMultiplier) !== 100 && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Server Exp %</p>
                  <p className="text-4xl font-bold text-green-400">
                    {serverMultiplier}%
                  </p>
                </div>
              )}

              {/* Equipment Exp % - Only show if not 0 */}
              {parseFloat(equipmentExp) > 0 && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Equipment Exp %</p>
                  <p className="text-4xl font-bold text-purple-400">
                    +{equipmentExp}%
                  </p>
                </div>
              )}

              {/* Exp Buff % - Only show if not 0 */}
              {parseFloat(expBuff) > 0 && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Exp Buff %</p>
                  <p className="text-4xl font-bold text-pink-400">
                    +{expBuff}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
