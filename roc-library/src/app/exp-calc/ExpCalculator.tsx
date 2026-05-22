'use client';

import { useState, useMemo, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { EXP_TABLES, ClassType } from '@/data/expTables';

interface ExpRange {
  startLevel: number;
  startPercent: number;
  endLevel: number;
  endPercent: number;
}

interface DetailItem {
  id: number;
  label: string;
  value: string;
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
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [serverMultiplier, setServerMultiplier] = useState('100');
  const [equipmentItems, setEquipmentItems] = useState<DetailItem[]>([
    { id: 1, label: '', value: '0' },
  ]);
  const [expBuffItems, setExpBuffItems] = useState<DetailItem[]>([
    { id: 1, label: '', value: '0' },
  ]);

  const addItem = (setter: React.Dispatch<React.SetStateAction<DetailItem[]>>) => {
    setter((prev) => [...prev, { id: Date.now(), label: '', value: '0' }]);
  };

  const removeItem = (setter: React.Dispatch<React.SetStateAction<DetailItem[]>>, id: number) => {
    setter((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };

  const updateItem = (
    setter: React.Dispatch<React.SetStateAction<DetailItem[]>>,
    id: number,
    field: 'label' | 'value',
    value: string
  ) => {
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const totalEquipmentExp = equipmentItems.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const totalExpBuff = expBuffItems.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);

  const summaryRef = useRef<HTMLDivElement>(null);

  const downloadSummary = async () => {
    if (!summaryRef.current) return;
    const dataUrl = await htmlToImage.toPng(summaryRef.current, {
      backgroundColor: '#1e293b',
      pixelRatio: 2,
      cacheBust: true,
    });
    const link = document.createElement('a');
    link.download = `exp-summary-lv${expRange.startLevel}-to-${expRange.endLevel}.png`;
    link.href = dataUrl;
    link.click();
  };

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
                    const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
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

            </div>

            {/* Equipment Exp % List */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  Equipment Exp % <span className="text-purple-400 ml-1">รวม +{totalEquipmentExp}%</span>
                </label>
                <button
                  type="button"
                  onClick={() => addItem(setEquipmentItems)}
                  className="btn btn-xs btn-outline btn-purple text-purple-400 border-purple-500 hover:bg-purple-500 hover:text-white"
                >
                  + เพิ่ม
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {equipmentItems.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(setEquipmentItems, item.id, 'label', e.target.value)}
                      className="input input-bordered input-sm w-full text-slate-800 text-sm"
                      placeholder="เช่น ส่วนหัว, แหวน"
                    />
                    <div className="relative shrink-0 w-24">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={item.value}
                        onChange={(e) => updateItem(setEquipmentItems, item.id, 'value', e.target.value)}
                        onBlur={(e) => {
                          const val = Math.max(0, parseFloat(e.target.value) || 0);
                          updateItem(setEquipmentItems, item.id, 'value', val.toString());
                        }}
                        className="input input-bordered input-sm w-full text-slate-800 text-sm pr-6"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(setEquipmentItems, item.id)}
                      className="btn btn-xs btn-ghost text-slate-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exp Buff % List */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  Exp Buff % <span className="text-pink-400 ml-1">รวม +{totalExpBuff}%</span>
                </label>
                <button
                  type="button"
                  onClick={() => addItem(setExpBuffItems)}
                  className="btn btn-xs btn-outline text-pink-400 border-pink-500 hover:bg-pink-500 hover:text-white"
                >
                  + เพิ่ม
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {expBuffItems.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(setExpBuffItems, item.id, 'label', e.target.value)}
                      className="input input-bordered input-sm w-full text-slate-800 text-sm"
                      placeholder="เช่น VIP Card, Blessing"
                    />
                    <div className="relative shrink-0 w-24">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={item.value}
                        onChange={(e) => updateItem(setExpBuffItems, item.id, 'value', e.target.value)}
                        onBlur={(e) => {
                          const val = Math.max(0, parseFloat(e.target.value) || 0);
                          updateItem(setExpBuffItems, item.id, 'value', val.toString());
                        }}
                        className="input input-bordered input-sm w-full text-slate-800 text-sm pr-6"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(setExpBuffItems, item.id)}
                      className="btn btn-xs btn-ghost text-slate-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-6">
          <button
            onClick={downloadSummary}
            className="bg-linear-to-r text-white from-amber-500 to-orange-500 px-4 py-2 rounded-md font-semibold hover:brightness-110 mb-3 flex items-center gap-2"
          >
            💾 Download Summary
          </button>
          <div ref={summaryRef} className="card bg-slate-800/50 backdrop-blur border border-slate-700 shadow-2xl">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-2xl font-bold text-amber-400 mb-2">Summary</h2>

            {/* Level Range Summary */}
            <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
              <span className="text-slate-200 font-semibold">
                Lv.{expRange.startLevel}
              </span>
              <span className="text-amber-500/70">{expRange.startPercent}%</span>
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
                  {calculateExpNeeded.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* Time - Only show if not 0:00 */}
              {(parseInt(hours) > 0 || parseInt(minutes) > 0) && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">เวลาเล่น</p>
                  <p className="text-4xl font-bold text-blue-400">
                    {parseInt(hours)}:{String(parseInt(minutes) || 0).padStart(2, '0')} <span className="text-lg">hrs</span>
                  </p>
                </div>
              )}
            </div>

            {/* Multipliers Row */}
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

              {/* Equipment Exp % - Only show if total > 0 */}
              {totalEquipmentExp > 0 && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Equipment Exp %</p>
                  <p className="text-4xl font-bold text-purple-400 mb-2">+{totalEquipmentExp}%</p>
                  <ul className="text-xs text-slate-400 space-y-0.5">
                    {equipmentItems
                      .filter((item) => parseFloat(item.value) > 0)
                      .map((item) => (
                        <li key={item.id} className="flex justify-between gap-2">
                          <span className="text-slate-300">{item.label || '—'}</span>
                          <span className="text-purple-300">+{item.value}%</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Exp Buff % - Only show if total > 0 */}
              {totalExpBuff > 0 && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Exp Buff %</p>
                  <p className="text-4xl font-bold text-pink-400 mb-2">+{totalExpBuff}%</p>
                  <ul className="text-xs text-slate-400 space-y-0.5">
                    {expBuffItems
                      .filter((item) => parseFloat(item.value) > 0)
                      .map((item) => (
                        <li key={item.id} className="flex justify-between gap-2">
                          <span className="text-slate-300">{item.label || '—'}</span>
                          <span className="text-pink-300">+{item.value}%</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>

      </div>
    </div>
  );
}
