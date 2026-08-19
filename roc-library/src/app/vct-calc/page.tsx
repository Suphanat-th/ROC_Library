"use client";

import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";

const formatValue = (value: number, digits = 2) =>
  new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

export default function VctCalculatorPage() {
  const [baseVct, setBaseVct] = useState(1);
  const [dex, setDex] = useState(0);
  const [intelligence, setIntelligence] = useState(0);
  const [vctReduction, setVctReduction] = useState(0);
  const [aspd, setAspd] = useState(190);

  const calculation = useMemo(() => {
    const statRatio = Math.max((dex * 2 + intelligence) / 530, 0);

    const statMultiplier = Math.max(1 - Math.sqrt(statRatio)  , 0);
    const reductionMultiplier = Math.max(1 - vctReduction / 100, 0);
    const castingDelay = (200 - aspd) / 50;
    
    return {
      statRatio,
      statMultiplier,
      reductionMultiplier,
      finalVct: baseVct * statMultiplier * reductionMultiplier,
      castingDelay,
      castsPerSecond: castingDelay > 0 ? 1 / castingDelay : null,
    };
  }, [aspd, baseVct, dex, intelligence, vctReduction]);

  const updateNumber = (value: string, setter: (nextValue: number) => void) => {
    const nextValue = Number(value);
    setter(Number.isFinite(nextValue) ? Math.max(0, nextValue) : 0);
  };

  const fields = [
    {
      id: "base-vct",
      label: "BaseVCT",
      description: "VCT ของสกิล (วินาที)",
      value: baseVct,
      onChange: setBaseVct,
      step: "0.1",
    },
    {
      id: "dex",
      label: "DEX",
      description: "ค่า DEX รวมทั้งหมด",
      value: dex,
      onChange: setDex,
      step: "1",
    },
    {
      id: "int",
      label: "INT",
      description: "ค่า INT รวมทั้งหมด",
      value: intelligence,
      onChange: setIntelligence,
      step: "1",
    },
    {
      id: "vct-reduction",
      label: "Sum_VCTReduc",
      description: "VCT Reduction รวม (%)",
      value: vctReduction,
      onChange: setVctReduction,
      step: "0.1",
    },
    {
      id: "aspd",
      label: "ASPD",
      description: "ASPD สำหรับ Casting delay (สูงสุด 200)",
      value: aspd,
      onChange: (nextValue: number) => setAspd(Math.min(200, nextValue)),
      step: "0.1",
    },
  ];

  return (
    <main className="min-h-full bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-cyan-400/25 pb-6">
          <div className="flex items-center gap-3 text-cyan-300">
            <Calculator aria-hidden="true" className="size-6" />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">
              Ragnarok Classic
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            VCT Calculator
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            คำนวณระยะเวลาร่ายแบบแปรผันของสกิล
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
          <section className="border border-slate-700 bg-slate-900/80 p-5 shadow-lg shadow-black/20 sm:p-6">
            <h2 className="text-base font-bold text-cyan-300">ค่าเข้าสมการ</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.id} htmlFor={field.id} className="block">
                  <span className="block text-sm font-semibold text-white">
                    {field.label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {field.description}
                  </span>
                  <input
                    id={field.id}
                    type="number"
                    min="0"
                    step={field.step}
                    value={field.value}
                    onChange={(event) =>
                      updateNumber(event.target.value, field.onChange)
                    }
                    className="mt-2 w-full border border-slate-600 bg-slate-950 px-3 py-2.5 font-mono text-base text-cyan-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 border-l-2 border-cyan-400 bg-cyan-400/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-300">
                Formula
              </p>
              <p className="mt-2 overflow-x-auto font-mono text-sm leading-7 text-slate-200">
                BaseVCT x (1 - sqrt((DEX x 2 + INT) / 530)) x (1 - Sum_VCTReduc
                / 100)
              </p>
            </div>
          </section>

          <aside className="border border-cyan-400/35 bg-cyan-400/10 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
              Variable Cast Time
            </p>
            <output className="mt-3 block font-mono text-5xl font-bold text-white">
              {formatValue(calculation.finalVct)}{" "}
              <span className="text-2xl text-cyan-200">sec</span>
            </output>
            <p className="mt-2 text-sm text-cyan-100/80">VCT หลังคำนวณ</p>

            <dl className="mt-6 space-y-3 border-t border-cyan-200/20 pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-300">Base Vct</dt>
                <dd className="font-mono font-semibold text-white">
                  {baseVct} วิ
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-300">DEX x 2 + INT</dt>
                <dd className="font-mono font-semibold text-white">
                  {formatValue(dex * 2 + intelligence, 0)}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-300">
                  1 - sqrt({formatValue(dex * 2 + intelligence, 0)}) / 530
                </dt>
                <dd className="font-mono font-semibold text-white">
                  {formatValue(calculation.statMultiplier, 4)}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-300">VCT Gear</dt>
                <dd className="font-mono font-semibold text-white">
                  {vctReduction} %
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-300">1 - Sum_VCTReduc / 100</dt>
                <dd className="font-mono font-semibold text-white">
                  {formatValue(calculation.reductionMultiplier, 4)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-cyan-200/20 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                Casting ASPD Delay (Type 1)
              </p>
              <p className="mt-2 font-mono text-3xl font-bold text-white">
                {formatValue(calculation.castingDelay)}{" "}
                <span className="text-lg text-cyan-200">sec</span>
              </p>
              <p className="mt-1 text-sm text-cyan-100/80">
                {calculation.castsPerSecond === null
                  ? "ไม่มี delay จาก ASPD"
                  : `${formatValue(calculation.castsPerSecond)} casts/s`}
              </p>
              <p className="mt-3 font-mono text-xs text-slate-300">
                (200 - ASPD) / 50
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
