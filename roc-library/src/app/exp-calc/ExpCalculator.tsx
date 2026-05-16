'use client';

import { useState, useMemo } from 'react';
import { EXP_TABLES, ClassType } from '@/data/expTables';

interface ExpRange {
  startLevel: number;
  startPercent: number;
  endLevel: number;
  endPercent: number;
}

export default function ExpCalculator() {
  const [selectedClass, setSelectedClass] = useState<ClassType>('hiClass');
  const [expRange, setExpRange] = useState<ExpRange>({
    startLevel: 1,
    startPercent: 0,
    endLevel: 2,
    endPercent: 0,
  });
  const [startPercentInput, setStartPercentInput] = useState('0');
  const [endPercentInput, setEndPercentInput] = useState('0');

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
          <p className="text-slate-300">Calculate experience needed between levels</p>
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
                      const classLevels = Object.keys(EXP_TABLES[classKey].levels).map(Number);
                      const minLvl = Math.min(...classLevels);
                      setExpRange({
                        startLevel: minLvl,
                        startPercent: 0,
                        endLevel: minLvl + 1,
                        endPercent: 0,
                      });
                      setStartPercentInput('0');
                      setEndPercentInput('0');
                    }}
                    className={`btn btn-sm md:btn-md ${
                      selectedClass === classKey
                        ? 'btn-warning text-black font-bold'
                        : 'btn-outline btn-warning'
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
                  onChange={(e) =>
                    setExpRange((prev) => ({
                      ...prev,
                      startLevel: Number(e.target.value),
                    }))
                  }
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
                  onChange={(e) =>
                    setExpRange((prev) => ({
                      ...prev,
                      endLevel: Number(e.target.value),
                    }))
                  }
                  className="select select-bordered select-warning w-full text-slate-800"
                >
                  {availableLevels.map((lvl) => (
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

            {/* Result Section */}
            <div className="divider text-slate-400">Result</div>
            <div className="bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-6 mb-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Experience Required</p>
                <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-400">
                  {calculateExpNeeded.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <p className="text-slate-300 text-center">
                <span className="font-semibold text-amber-400">
                  {EXP_TABLES[selectedClass].name}
                </span>
                {' • '}
                <span>
                  Lv{expRange.startLevel} {expRange.startPercent}%
                </span>
                {' → '}
                <span>
                  Lv{expRange.endLevel} {expRange.endPercent}%
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">How it works</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• <span className="font-semibold">Progress %</span>: Your current progress towards the next level (0-99.99%)</li>
            <li>• <span className="font-semibold">Example</span>: Lv1 50% means you&apos;re halfway to level 2</li>
            <li>• The calculator shows total EXP needed to reach your target level and progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
