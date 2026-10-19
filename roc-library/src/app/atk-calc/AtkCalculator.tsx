"use client";

import { Fragment, useEffect, useState, useSyncExternalStore } from "react";
import { DEFAULT_ATK_INPUT, calcATK } from "@/utils/atkFormula";
import type { AtkInput } from "./types";
import { InputField, SelectField } from "./components/FieldControls";
import ResultPanel from "./components/ResultPanel";

const STORAGE_KEY = "roc-atk-calc";

const STAT_ROWS = [
  { name: "STR", base: "strBase", bonus: "strBonus" },
  { name: "DEX", base: "dexBase", bonus: "dexBonus" },
  { name: "LUK", base: "lukBase", bonus: "lukBonus" },
] as const;

function loadInput(): AtkInput {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_ATK_INPUT, ...JSON.parse(raw) };
  } catch {
    // storage unavailable or corrupted: keep defaults
  }
  return DEFAULT_ATK_INPUT;
}

const subscribeNoop = () => () => {};

// Render only on the client so the saved values can be read without a hydration mismatch.
export default function AtkCalculator() {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  return mounted ? <AtkCalculatorBody /> : null;
}

function AtkCalculatorBody() {
  const [input, setInput] = useState<AtkInput>(loadInput);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
    } catch {
      // ignore
    }
  }, [input]);

  const set = <K extends keyof AtkInput>(key: K, value: AtkInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const result = calcATK(input);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">คำนวณ ATK / ดาเมจ</h1>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => setInput(DEFAULT_ATK_INPUT)}
        >
          รีเซ็ต
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-base-content/10 bg-base-200 p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Status</h2>
            <div className="mb-4">
              <SelectField label="ประเภทการโจมตี">
                <select
                  className="select select-bordered select-sm w-full"
                  value={input.range}
                  onChange={(e) => set("range", e.target.value as AtkInput["range"])}
                >
                  <option value="melee">ระยะใกล้ (Melee)</option>
                  <option value="ranged">ระยะไกล (Ranged)</option>
                </select>
              </SelectField>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InputField label="Base Level" value={input.baseLevel} min={1} max={999} onChange={(v) => set("baseLevel", v)} />
            </div>
            <div className="grid grid-cols-[3rem_1fr_1fr_3.5rem] items-end gap-x-3 gap-y-2">
              <span />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">ค่าตัวละคร</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">+ โบนัส</span>
              <span className="text-right text-xs font-bold uppercase tracking-widest text-primary">รวม</span>
              {STAT_ROWS.map(({ name, base, bonus }) => (
                <Fragment key={name}>
                  <span className="pb-2 text-sm font-bold">{name}</span>
                  <InputField hideLabel label={`${name} ค่าตัวละคร`} value={input[base]} min={1} max={999} onChange={(v) => set(base, v)} />
                  <InputField hideLabel label={`${name} โบนัส`} value={input[bonus]} min={0} max={999} onChange={(v) => set(bonus, v)} />
                  <span className="pb-2 text-right font-mono text-sm font-bold">{input[base] + input[bonus]}</span>
                </Fragment>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-base-content/10 bg-base-200 p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">อาวุธและ ATK อื่น</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InputField label="Base Weapon ATK" value={input.weaponAtk} hint="ค่า ATK ในหน้าต่างไอเท็ม" onChange={(v) => set("weaponAtk", v)} />
              <SelectField label="Weapon Level">
                <select
                  className="select select-bordered select-sm w-full"
                  value={input.weaponLevel}
                  onChange={(e) => set("weaponLevel", Number(e.target.value))}
                >
                  {[1, 2, 3, 4].map((lv) => (
                    <option key={lv} value={lv}>Lv.{lv}</option>
                  ))}
                </select>
              </SelectField>
              <InputField label="Refine" value={input.refine} min={0} max={20} suffix="+" onChange={(v) => set("refine", v)} />
              <InputField label="Equip ATK" value={input.equipAtk} hint="อุปกรณ์อื่น / ยา-ของกินใช้ / ลูกธนู-กระสุน / บัพ" onChange={(v) => set("equipAtk", v)} />
              <InputField label="Mastery ATK" value={input.masteryAtk} onChange={(v) => set("masteryAtk", v)} />
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={input.maxVariance}
                onChange={(e) => set("maxVariance", e.target.checked)}
              />
              Critical / Power Maximize (Variance ออกค่า Max เสมอ)
            </label>
          </section>

          <section className="rounded-2xl border border-base-content/10 bg-base-200 p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">ตัวคูณ ATK</h2>
            <p className="mb-2 text-xs text-base-content/60">ระดับ 1: %ATK (บวกท้ายสุดหลังระดับ 2)</p>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InputField label="%ATK" value={input.atkPct} max={9999} suffix="%" onChange={(v) => set("atkPct", v)} />
            </div>
            <p className="mb-2 text-xs text-base-content/60">ระดับ 2: เผ่า / ขนาด / ธาตุ / ประเภท (คนละกลุ่มคูณกัน)</p>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InputField label="%เผ่า" value={input.racePct} max={9999} suffix="%" onChange={(v) => set("racePct", v)} />
              <InputField label="%ขนาด" value={input.sizePct} max={9999} suffix="%" onChange={(v) => set("sizePct", v)} />
              <InputField label="%ธาตุ" value={input.elementPct} max={9999} suffix="%" onChange={(v) => set("elementPct", v)} />
              <InputField label="%ประเภท" value={input.typePct} max={9999} suffix="%" onChange={(v) => set("typePct", v)} />
            </div>
            <p className="mb-2 text-xs text-base-content/60">ระดับ 3 (Final): ใช้กับ ATK ทุกส่วน</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InputField
                label={input.range === "melee" ? "%ระยะใกล้" : "%ระยะไกล"}
                value={input.rangePct}
                max={9999}
                suffix="%"
                onChange={(v) => set("rangePct", v)}
              />
              <InputField label="%Critical / %Hit physical" value={input.critPct} max={9999} suffix="%" onChange={(v) => set("critPct", v)} />
            </div>
          </section>

          <section className="rounded-2xl border border-base-content/10 bg-base-200 p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">สกิลและเป้าหมาย</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InputField label="Skill %" value={input.skillPct} max={99999} suffix="%" hint="ตีธรรมดา = 100" onChange={(v) => set("skillPct", v)} />
              <InputField label="DEF เป้าหมาย" value={input.def} hint="ยังไม่นำมาคำนวณ" onChange={(v) => set("def", v)} />
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <ResultPanel result={result} />
        </div>
      </div>
    </div>
  );
}
