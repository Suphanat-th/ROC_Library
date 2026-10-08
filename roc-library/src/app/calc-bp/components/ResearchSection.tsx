import React, { useMemo, useState } from "react";
import Image from "next/image";
import { RESEARCH_MEDAL_NAME, RESEARCH_TYPES } from "@/data/researchData";
import {
  calcResearch,
  formatMinutes,
  simulateResearch,
} from "@/utils/researchCalc";

interface ResearchSectionProps {
  formatNumber: (num: number | string) => string;
}

const COLORS = {
  accent: "#2e8bff", // Electric Blue
  min: "#bfe3ff", // Silver / Ice Blue
  max: "#34d399", // Emerald
  random: "#fbbf24", // Gold
};

interface ResultCardProps {
  label: string;
  value: string;
  color: string;
  image?: string;
  large?: boolean;
  className?: string;
  onRandom?: () => void;
  percent?: number; // position of the value between min and max, 0-100
}

const getRangeClass = (percent: number) => {
  if (percent < 40) return "range-error";
  if (percent <= 70) return "range-warning";
  return "range-info";
};

function ResultCard({
  label,
  value,
  color,
  image,
  large,
  className = "",
  onRandom,
  percent,
}: ResultCardProps) {
  const valueClass = `font-black text-white ${large ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"}`;
  const valueStyle = { textShadow: `0 0 10px ${color}, 0 0 22px ${color}88` };

  return (
    <div
      className={`rounded-xl p-5 text-center ${className}`}
      style={{
        border: `1px solid ${color}`,
        boxShadow: `0 0 10px ${color}66, inset 0 0 14px ${color}22`,
      }}
    >
      {image ? (
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex flex-col items-center">
            <Image
              src={image}
              alt={label}
              width={300}
              height={300}
              className={`mb-2 `}
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
            <div className="text-sm font-bold tracking-wide" style={{ color }}>
              {label}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className={valueClass} style={valueStyle}>
              {value}
            </div>
            {onRandom && (
              <button
                type="button"
                onClick={onRandom}
                className="btn btn-sm border bg-transparent font-bold hover:bg-white/10"
                style={{ borderColor: color, color }}
              >
                Random
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm font-bold tracking-wide" style={{ color }}>
            {label}
          </div>
          <div className={`mt-1 ${valueClass}`} style={valueStyle}>
            {value}
          </div>
        </>
      )}
      {percent !== undefined && (
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="100"
            value={percent}
            readOnly
            aria-label={`${label} position`}
            className={`range pointer-events-none w-full ${getRangeClass(percent)}`}
          />
          <div className="mt-1 text-xs font-bold" style={{ color }}>
            {Math.round(percent)}%
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResearchSection({
  formatNumber,
}: ResearchSectionProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [rollId, setRollId] = useState(0);

  const result = useMemo(() => calcResearch(RESEARCH_TYPES, counts), [counts]);
  const rolledMedals = useMemo(
    // rollId re-triggers the roll when the Random button is pressed
    () => simulateResearch(RESEARCH_TYPES, counts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [counts, rollId],
  );

  const rollPercent =
    result.maxMedals > result.minMedals
      ? ((rolledMedals - result.minMedals) /
          (result.maxMedals - result.minMedals)) *
        100
      : 100;

  const parseNumber = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-linear-to-r from-blue-200/20 via-blue-400/70 to-blue-200/20"></div>
        <span className="rounded-full border border-blue-300/60 bg-blue-950/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-200">
          Research Calculator
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-blue-200/20 via-blue-400/70 to-blue-200/20"></div>
      </div>

      <div className="card w-full border border-blue-900/80 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-sm">
        <div className="card-body p-4 sm:p-6 lg:p-7">
          <h2 className="card-title mb-2 flex items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl">
            <span className="text-2xl">📚</span> Researching
          </h2>
          <p className="mb-6 text-xs text-slate-400">
            หนังสือ 1 เล่ม = 1 ครั้ง ทำได้ทีละครั้ง • ผลตอบแทนเป็น{" "}
            {RESEARCH_MEDAL_NAME}
          </p>

          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {RESEARCH_TYPES.map((type) => (
              <div
                key={type.key}
                className="grid grid-cols-2 items-center gap-4 rounded-xl border-l-4 border-blue-500 bg-white p-6 text-slate-900 shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={type.img}
                    alt={type.name}
                    width={120}
                    height={120}
                    className="mb-2 h-30 w-30"
                  />
                  <span className="font-bold text-gray-700">{type.name}</span>
                  <span className="text-xs text-gray-500">
                    {type.minutes} นาที/ครั้ง
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500">จำนวนหนังสือ</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={counts[type.key] ?? 0}
                    onChange={(e) =>
                      setCounts((current) => ({
                        ...current,
                        [type.key]: parseNumber(e.target.value),
                      }))
                    }
                    placeholder="0"
                    className="input input-bordered input-lg w-full border-blue-300 bg-white text-center text-3xl font-bold text-blue-600 focus:input-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl bg-linear-to-r from-slate-900 to-blue-950 p-4"
            style={{
              border: `1px solid ${COLORS.accent}`,
              boxShadow: `0 0 12px ${COLORS.accent}55`,
            }}
          >
            {result.totalBooks === 0 ? (
              <div className="text-center text-sm text-blue-200">
                กรอกจำนวนหนังสือเพื่อคำนวณ
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ResultCard
                  label="ระยะเวลา"
                  value={formatMinutes(result.totalMinutes)}
                  color={COLORS.accent}
                  className="sm:col-span-2"
                />
                <ResultCard
                  label={`Minimum ${RESEARCH_MEDAL_NAME}`}
                  value={formatNumber(result.minMedals)}
                  color={COLORS.min}
                  image="/assets/images/bp/mysterious_medal_l.png"
                />
                <ResultCard
                  label={`Maximum ${RESEARCH_MEDAL_NAME}`}
                  value={formatNumber(result.maxMedals)}
                  color={COLORS.max}
                  image="/assets/images/bp/mysterious_medal_u.png"
                />
                <ResultCard
                  label={`Random Roll ${RESEARCH_MEDAL_NAME}`}
                  value={formatNumber(rolledMedals)}
                  color={COLORS.random}
                  image="/assets/images/bp/mysterious_medal_rd.png"
                  onRandom={() => setRollId((id) => id + 1)}
                  percent={rollPercent}
                  className="sm:col-span-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
