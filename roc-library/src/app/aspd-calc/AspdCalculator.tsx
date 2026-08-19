"use client";

import React, { useMemo, useState } from "react";
import { CLASS_TIERS, JOBS, JOBS_EXTENDED, POTIONS, WEAPONS } from "@/data/aspdData";
import { calcASPD, stepsToASPD } from "@/utils/aspdFormula";
import type { ClassTier, OffHandSelection } from "./types";
import { InputField, SelectField } from "./components/FieldControls";
import FormulaBreakdownPanel from "./components/FormulaBreakdownPanel";
import ResultPanel from "./components/ResultPanel";
import ReverseCalcPanel from "./components/ReverseCalcPanel";

export default function AspdCalculator() {
  const [jobIdx, setJobIdx] = useState(2);
  const [weaponIdx, setWeaponIdx] = useState(3);
  const [offHand, setOffHand] = useState<OffHandSelection>("none");
  const [agiFront, setAgiFront] = useState(90);
  const [agiBack, setAgiBack] = useState(0);
  const [dexFront, setDexFront] = useState(30);
  const [dexBack, setDexBack] = useState(0);
  const [potionIdx, setPotionIdx] = useState(0);
  const [skillPct, setSkillPct] = useState(0);
  const [specialPct, setSpecialPct] = useState(0);
  const [equipPct, setEquipPct] = useState(0);
  const [flatASPD, setFlatASPD] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  const [targetASPD, setTargetASPD] = useState(190);
  const [classTier, setClassTier] = useState<ClassTier>("class12");

  const currentJobs = classTier === "extended" ? JOBS_EXTENDED : JOBS;
  const maxASPD = CLASS_TIERS[classTier].maxASPD;
  const safeJobIdx = Math.min(jobIdx, currentJobs.length - 1);
  const job = currentJobs[safeJobIdx] ?? currentJobs[0];
  const safeWeaponIdx = job.weapons.includes(weaponIdx) ? weaponIdx : (job.weapons[0] ?? 0);
  const weapon = WEAPONS[safeWeaponIdx];
  const weaponFactor = job.weaponFactors[safeWeaponIdx] ?? 0;
  const potion = POTIONS[potionIdx] ?? POTIONS[0];
  const offHandIndex = offHand.startsWith("w:") ? Number.parseInt(offHand.slice(2), 10) : null;
  const offHandFactor = offHand === "shield"
    ? job.shieldPenalty
    : offHandIndex !== null
      ? (job.weaponFactors[offHandIndex] ?? 0)
      : 0;
  const offHandLabel = offHand === "none"
    ? "—"
    : offHand === "shield"
      ? `Shield (${job.shieldPenalty})`
      : (offHandIndex !== null ? WEAPONS[offHandIndex]?.label ?? "Unknown" : "Unknown");

  const isAssassinCross = job.label.includes("Assassin");
  const poisonWarning = potion.assassinOnly && !isAssassinCross;
  const effectivePotionMod = poisonWarning ? 0 : potion.mod;
  const agi = agiFront + agiBack;
  const dex = dexFront + dexBack;

  const result = useMemo(
    () => calcASPD(
      job.baseASPD,
      weaponFactor,
      offHandFactor,
      agi,
      dex,
      effectivePotionMod,
      skillPct / 100,
      specialPct / 100,
      equipPct / 100,
      flatASPD,
      maxASPD,
    ),
    [job.baseASPD, weaponFactor, offHandFactor, agi, dex, effectivePotionMod, skillPct, specialPct, equipPct, flatASPD, maxASPD],
  );

  const reverseCalc = useMemo(
    () => stepsToASPD(
      targetASPD,
      job.baseASPD,
      weaponFactor,
      offHandFactor,
      agi,
      dex,
      effectivePotionMod,
      skillPct / 100,
      specialPct / 100,
      equipPct / 100,
      flatASPD,
      maxASPD,
    ),
    [targetASPD, job.baseASPD, weaponFactor, offHandFactor, agi, dex, effectivePotionMod, skillPct, specialPct, equipPct, flatASPD, maxASPD],
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "linear-gradient(135deg, #020818 0%, #061030 40%, #0a0520 100%)" }}
    >
      <div className="relative overflow-hidden pb-1">
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg, #00bfff 0px, #00bfff 1px, transparent 1px, transparent 18px)" }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center px-4 pb-6 pt-10 text-center">
          <div className="mb-1 text-4xl">⚡</div>
          <h1
            className="text-4xl font-black uppercase tracking-widest sm:text-5xl"
            style={{ color: "#38bdf8", textShadow: "0 0 20px #38bdf8, 0 0 50px #0ea5e9" }}
          >
            The Flash Calc
          </h1>
          <p className="mt-2 text-base font-bold uppercase tracking-[0.3em]" style={{ color: "#7dd3fc" }}>
            ASPD Calculator
          </p>
          <p className="mt-1 text-xs tracking-widest text-white/30">Ragnarok Online Classic</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-4 rounded-2xl border border-sky-500/20 p-5" style={{ background: "rgba(10,20,50,0.8)" }}>
              <h2 className="border-b border-sky-500/20 pb-2 text-sm font-bold uppercase tracking-widest text-sky-400">
                ⚙️ Job &amp; Equipment
              </h2>

              <SelectField label="Class Tier">
                <select
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-all focus:border-sky-400/60 focus:outline-none"
                  value={classTier}
                  onChange={(event) => {
                    const nextTier = event.target.value as ClassTier;
                    const jobs = nextTier === "extended" ? JOBS_EXTENDED : JOBS;
                    const nextJob = jobs[0];

                    setClassTier(nextTier);
                    setJobIdx(0);
                    setOffHand("none");

                    if (nextJob && !nextJob.weapons.includes(weaponIdx)) {
                      setWeaponIdx(nextJob.weapons[0] ?? 0);
                    }
                  }}
                >
                  <option value="class12" className="bg-gray-900 text-white">⚔️ Class 1-2 (Max ASPD 190)</option>
                  <option value="extended" className="bg-gray-900 text-white">🌟 Extended Class (Max ASPD 193)</option>
                  <option value="awakened" className="bg-gray-900 text-white">✨ Awakened Class (Coming Soon)</option>
                </select>
              </SelectField>

              {classTier === "awakened" ? (
                <div className="flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-5">
                  <span className="text-3xl">🚧</span>
                  <div>
                    <p className="text-sm font-bold text-yellow-400">Coming Soon</p>
                    <p className="mt-0.5 text-xs text-white/40">ยังไม่มีข้อมูล ASPD สำหรับ Awakened Class</p>
                  </div>
                </div>
              ) : (
                <>
                  <SelectField label="Job Class">
                    <select
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-all focus:border-sky-400/60 focus:outline-none"
                      value={safeJobIdx}
                      onChange={(event) => {
                        const nextJobIdx = Number(event.target.value);
                        const nextJob = currentJobs[Math.min(nextJobIdx, currentJobs.length - 1)];

                        setJobIdx(nextJobIdx);
                        setOffHand("none");

                        if (nextJob && !nextJob.weapons.includes(weaponIdx)) {
                          setWeaponIdx(nextJob.weapons[0] ?? 0);
                        }
                      }}
                    >
                      {currentJobs.map((entry, index) => (
                        <option key={entry.label} value={index} className="bg-gray-900 text-white">
                          {entry.icon} {entry.label}
                        </option>
                      ))}
                    </select>
                  </SelectField>

                  <SelectField label="Weapon Type" hint={`Weapon factor: ${weaponFactor >= 0 ? "+" : ""}${weaponFactor}`}>
                    <select
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-all focus:border-sky-400/60 focus:outline-none"
                      value={safeWeaponIdx}
                      onChange={(event) => {
                        setWeaponIdx(Number(event.target.value));
                        setOffHand("none");
                      }}
                    >
                      {WEAPONS.map((entry, index) => (
                        job.weapons.includes(index) ? (
                          <option key={entry.label} value={index} className="bg-gray-900 text-white">
                            {entry.label} {job.weaponFactors[index] !== undefined ? `(${job.weaponFactors[index] >= 0 ? "+" : ""}${job.weaponFactors[index]})` : ""}
                          </option>
                        ) : null
                      ))}
                    </select>
                  </SelectField>

                  <SelectField label="Off-Hand" hint={`Off-hand penalty: ${offHandFactor}`}>
                    <select
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-all focus:border-sky-400/60 focus:outline-none"
                      value={offHand}
                      onChange={(event) => setOffHand(event.target.value as OffHandSelection)}
                    >
                      <option value="none" className="bg-gray-900 text-white">— ว่าง (ไม่ใส่) —</option>
                      <option value="shield" className="bg-gray-900 text-white">🛡️ Shield ({job.shieldPenalty})</option>
                      <optgroup label="⚔️ Dual Wield" className="bg-gray-900 text-white/60">
                        {WEAPONS.map((entry, index) => (
                          entry.canOffHand && job.weapons.includes(index) ? (
                            <option key={`offhand-${entry.label}`} value={`w:${index}`} className="bg-gray-900 text-white">
                              {entry.label}
                            </option>
                          ) : null
                        ))}
                      </optgroup>
                    </select>
                  </SelectField>
                </>
              )}
            </div>

            <div className="space-y-4 rounded-2xl border border-sky-500/20 p-5" style={{ background: "rgba(10,20,50,0.8)" }}>
              <h2 className="border-b border-sky-500/20 pb-2 text-sm font-bold uppercase tracking-widest text-sky-400">
                📊 Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="AGI หน้า" value={agiFront} onChange={setAgiFront} min={0} max={999} hint="ค่าสเตตัสหลักก่อนบวกส่วนเสริม" />
                <InputField label="AGI หลัง" value={agiBack} onChange={setAgiBack} min={0} max={999} hint="ค่าเสริมจากบัฟหรือโบนัสอื่น" />
                <InputField label="DEX หน้า" value={dexFront} onChange={setDexFront} min={0} max={999} hint="ค่าสเตตัสหลักก่อนบวกส่วนเสริม" />
                <InputField label="DEX หลัง" value={dexBack} onChange={setDexBack} min={0} max={999} hint="ค่าเสริมจากบัฟหรือโบนัสอื่น" />
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                <div className="flex items-center justify-between gap-3">
                  <span className="uppercase tracking-widest text-white/40">AGI Total</span>
                  <span className="font-mono font-bold text-sky-300">{agiFront} + {agiBack} = {agi}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="uppercase tracking-widest text-white/40">DEX Total</span>
                  <span className="font-mono font-bold text-sky-300">{dexFront} + {dexBack} = {dex}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-sky-500/20 p-5" style={{ background: "rgba(10,20,50,0.8)" }}>
              <h2 className="border-b border-sky-500/20 pb-2 text-sm font-bold uppercase tracking-widest text-sky-400">
                ✨ ASPD Bonuses
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-sky-300">Potion ASPD</label>
                  <select
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-all focus:border-sky-400/60 focus:outline-none"
                    value={potionIdx}
                    onChange={(event) => setPotionIdx(Number(event.target.value))}
                  >
                    {POTIONS.map((entry, index) => (
                      <option key={entry.label} value={index} className="bg-gray-900 text-white">
                        {entry.label}
                      </option>
                    ))}
                  </select>
                  {poisonWarning ? (
                    <div className="mt-1 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2">
                      <span className="mt-0.5 text-sm leading-none text-red-400">⚠️</span>
                      <p className="text-xs leading-snug text-red-300">
                        <span className="font-bold">Poison Bottle</span> ใช้ได้เฉพาะ <span className="font-bold text-red-200">Assassin Cross</span> เท่านั้น!
                        Class อื่นจะ <span className="font-bold text-red-200">ตายทันที</span> และระบบจะไม่คิด Potion ASPD
                      </p>
                    </div>
                  ) : null}
                  {!poisonWarning && potion.assassinOnly ? (
                    <p className="text-xs text-green-400/70">✅ Assassin Cross สามารถใช้ Poison Bottle ได้</p>
                  ) : null}
                </div>

                <InputField label="Skill ASPD" value={skillPct} onChange={setSkillPct} min={0} max={100} step={1} suffix="%" hint="เช่น Two-Hand Quicken, Adrenaline Rush" />
                <InputField label="Special ASPD" value={specialPct} onChange={setSpecialPct} min={0} max={100} step={1} suffix="%" hint="โบนัสพิเศษที่เข้ากลุ่มเดียวกับ Potion/Skill" />
                <InputField label="Equip ASPD Mod" value={equipPct} onChange={setEquipPct} min={0} max={100} step={1} suffix="%" hint="% ASPD จาก Equipment / Card" />
                <InputField label="Flat ASPD" value={flatASPD} onChange={setFlatASPD} min={0} max={50} hint="+ASPD แบบ flat จาก gear" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ResultPanel
              classTier={classTier}
              maxASPD={maxASPD}
              result={result}
              jobBaseASPD={job.baseASPD}
              weaponFactor={weaponFactor}
              offHandFactor={offHandFactor}
              flatASPD={flatASPD}
            />

            <ReverseCalcPanel
              currentASPD={result.final}
              maxASPD={maxASPD}
              targetASPD={targetASPD}
              agi={agi}
              dex={dex}
              reverseCalc={reverseCalc}
              onTargetChange={setTargetASPD}
            />

            <div className="space-y-2 rounded-2xl border border-white/10 p-4 text-xs" style={{ background: "rgba(10,20,50,0.7)" }}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Input Summary</h3>
              {[
                ["Job", `${job.icon} ${job.label}`],
                ["Weapon", weapon.label],
                ["Off-Hand", offHandLabel],
                ["AGI / DEX", `${agiFront}+${agiBack} / ${dexFront}+${dexBack}`],
                ["AGI Total / DEX Total", `${agi} / ${dex}`],
                ["Potion", potion.mod > 0 ? `${potion.mod * 100}%${poisonWarning ? " ⚠️" : ""}` : "—"],
                ["Skill ASPD", `${skillPct}%`],
                ["Special ASPD", `${specialPct}%`],
                ["Equip ASPD", `${equipPct}%`],
                ["Flat ASPD", `+${flatASPD}`],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="text-white/40">{key}</span>
                  <span className="max-w-[55%] truncate text-right font-medium text-white/70">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FormulaBreakdownPanel
          showFormula={showFormula}
          onToggle={() => setShowFormula((value) => !value)}
          result={result}
          jobBaseASPD={job.baseASPD}
          weaponFactor={weaponFactor}
          offHandFactor={offHandFactor}
          agi={agi}
          dex={dex}
          potionMod={effectivePotionMod}
          skillPct={skillPct}
          specialPct={specialPct}
          equipPct={equipPct}
          flatASPD={flatASPD}
          maxASPD={maxASPD}
        />
      </div>
    </div>
  );
}