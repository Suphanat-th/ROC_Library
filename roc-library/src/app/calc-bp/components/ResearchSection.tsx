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

// Theme-aware: resolves through the active DaisyUI theme (roc-light / roc-dark)
const COLORS = {
  accent: "var(--color-primary)",
  min: "var(--color-info)",
  max: "var(--color-success)",
  random: "var(--color-warning)",
};

const tint = (color: string, percent: number) =>
  `color-mix(in oklab, ${color} ${percent}%, transparent)`;

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
  const valueClass = `font-black text-base-content ${large ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"}`;

  return (
    <div
      className={`rounded-xl p-5 text-center ${className}`}
      style={{
        border: `1px solid ${color}`,
        backgroundColor: tint(color, 8),
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
              style={{ filter: `drop-shadow(0 0 6px ${tint(color, 60)})` }}
            />
            <div className="text-sm font-bold tracking-wide text-base-content/80">
              {label}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className={valueClass}>
              {value}
            </div>
            {onRandom && (
              <button
                type="button"
                onClick={onRandom}
                className="btn btn-sm btn-outline font-bold"
                style={{ borderColor: color }}
              >
                Random
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm font-bold tracking-wide text-base-content/80">
            {label}
          </div>
          <div className={`mt-1 ${valueClass}`}>
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
          <div className="mt-1 text-xs font-bold text-base-content/80">
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
        <div className="h-px flex-1 bg-base-300"></div>
        <span className="rounded-full border border-primary/30 bg-base-200 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
          Research Calculator
        </span>
        <div className="h-px flex-1 bg-base-300"></div>
      </div>

      <div className="card w-full border border-base-300 bg-base-100 text-base-content shadow-md">
        <div className="card-body p-4 sm:p-6 lg:p-7">
          <h2 className="card-title mb-2 flex items-center gap-2 text-xl font-black tracking-tight text-base-content sm:text-2xl">
            <span className="text-2xl">📚</span> Researching
          </h2>
          <p className="mb-6 text-xs text-base-content/60">
            สมุด 1 เล่ม = 1 ครั้ง ทำได้ทีละครั้ง • ผลตอบแทนเป็น{" "}
            {RESEARCH_MEDAL_NAME}
          </p>

          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {RESEARCH_TYPES.map((type) => (
              <div
                key={type.key}
                className="grid grid-cols-2 items-center gap-4 rounded-xl border-l-4 border-primary bg-base-100 p-6 text-base-content shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={type.img}
                    alt={type.name}
                    width={120}
                    height={120}
                    className="mb-2 h-30 w-30"
                  />
                  <span className="font-bold text-base-content/80">{type.name}</span>
                  <span className="text-xs text-base-content/60">
                    {type.minutes} นาที/ครั้ง
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-base-content/60">จำนวนสมุดวิจัย</span>
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
                    className="input input-bordered input-lg w-full border-primary/40 bg-base-100 text-center text-3xl font-bold text-primary focus:input-primary"
                  />
                  <span className="text-sm font-bold text-primary">
                    {formatMinutes((counts[type.key] ?? 0) * type.minutes)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl bg-base-200 p-4"
            style={{ border: `1px solid ${COLORS.accent}` }}
          >
            {result.totalBooks === 0 ? (
              <div className="text-center text-sm text-primary">
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
