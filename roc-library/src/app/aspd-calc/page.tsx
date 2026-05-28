"use client";

import React, { useState, useMemo } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

interface JobEntry {
  label: string;
  icon: string;
  baseASPD: number;    // Job base ASPD (bare hand)
  shieldPenalty: number; // Shield ASPD penalty (negative, 0 = can't equip)
  weapons: number[];   // Allowed weapon indexes (from WEAPONS array)
  weaponFactors: Record<number, number>; // weapon idx -> ASPD factor (negative = penalty)
}

interface WeaponEntry {
  label: string;
  canOffHand: boolean;  // Can be used in off-hand (dual wield)
}

const JOBS: JobEntry[] = [
  { label: "Novice",          icon: "🧑",  baseASPD: 156, shieldPenalty: -10, weapons: [0,1,2,6,8,9],           weaponFactors: {1:-15,2:-17,6:-10,8:-10,9:-25} },
  { label: "Swordsman",      icon: "⚔️",  baseASPD: 156, shieldPenalty:  -5, weapons: [0,1,2,3,4,5,6,7,8],      weaponFactors: {1:-7,2:-7,3:-14,4:-17,5:-25,6:-15,7:-20,8:-10} },
  { label: "Knight",         icon: "🛡️", baseASPD: 156, shieldPenalty:  -5, weapons: [0,1,2,3,4,5,6,7,8],      weaponFactors: {1:-9,2:-5,3:-12,4:-15,5:-25,6:-10,7:-15,8:-5} },
  { label: "Acolyte",        icon: "✨",  baseASPD: 156, shieldPenalty:  -7, weapons: [0,8,9],                   weaponFactors: {8:-5,9:-20} },
  { label: "Priest",         icon: "🙏",  baseASPD: 156, shieldPenalty:  -5, weapons: [0,8,9,10,12,16],          weaponFactors: {8:-3,9:-20,10:-20,12:-20,16:-4} },
  { label: "Mage",           icon: "🔮",  baseASPD: 146, shieldPenalty: -10, weapons: [0,1,9,10],                weaponFactors: {1:0,9:-5,10:-5} },
  { label: "Wizard",         icon: "🌀",  baseASPD: 146, shieldPenalty:  -8, weapons: [0,1,9,10],                weaponFactors: {1:-4,9:-3,10:-3} },
  { label: "Merchant",       icon: "💰",  baseASPD: 156, shieldPenalty:  -5, weapons: [0,1,2,6,7,8],             weaponFactors: {1:-12,2:-12,6:-8,7:-15,8:-10} },
  { label: "Blacksmith",     icon: "🔨",  baseASPD: 156, shieldPenalty:  -5, weapons: [0,1,2,6,7,8],             weaponFactors: {1:-10,2:-10,6:-6,7:-13,8:-8} },
  { label: "Archer",         icon: "🏹",  baseASPD: 156, shieldPenalty:  -9, weapons: [0,1,11],                  weaponFactors: {1:-15,11:-10} },
  { label: "Hunter",         icon: "🦅",  baseASPD: 156, shieldPenalty:  -9, weapons: [0,1,11],                  weaponFactors: {1:-13,11:-8} },
  { label: "Thief",          icon: "🗡️", baseASPD: 156, shieldPenalty:  -6, weapons: [0,1,2,6,13],              weaponFactors: {1:-8,2:-10,6:-20,13:-13} },
  { label: "Assassin",       icon: "💀",  baseASPD: 156, shieldPenalty:  -6, weapons: [0,1,2,6,13,18,19,22],    weaponFactors: {1:-2,2:-10,6:-11,13:-2,18:-10,19:-12,22:-12} },
  { label: "Crusader",       icon: "⛪",  baseASPD: 156, shieldPenalty:  -5, weapons: [0,1,2,3,4,5,6,7,8],      weaponFactors: {1:-8,2:-3,3:-15,4:-13,5:-12,6:-10,7:-15,8:-5} },
  { label: "Bard/Dancer",    icon: "🎵",  baseASPD: 156, shieldPenalty:  -7, weapons: [0,1,14,15],              weaponFactors: {1:-13,14:-8,15:-8} },
  { label: "Sage",           icon: "📖",  baseASPD: 151, shieldPenalty: -10, weapons: [0,1,9,10,16],             weaponFactors: {1:-8,9:-10,10:-10,16:2} },
  { label: "Monk",           icon: "👊",  baseASPD: 156, shieldPenalty:  -5, weapons: [0,8,9,10,12],             weaponFactors: {8:-3,9:-20,10:-18,12:0} },
  { label: "Rogue",          icon: "🎭",  baseASPD: 156, shieldPenalty:  -5, weapons: [0,1,2,6,13],              weaponFactors: {1:-5,2:-10,6:-159,13:-10} },
  { label: "Alchemist",      icon: "⚗️", baseASPD: 156, shieldPenalty:  -4, weapons: [0,1,2,6,7,8],             weaponFactors: {1:-10,2:-5,6:-5,7:-12,8:-5} },
  { label: "Taekwon Kid",    icon: "🥋",  baseASPD: 156, shieldPenalty:  -6, weapons: [0],                       weaponFactors: {} },
  { label: "Taekwon Master", icon: "🏆",  baseASPD: 156, shieldPenalty:  -6, weapons: [0],                       weaponFactors: {} },
  { label: "Soul Linker",    icon: "🌟",  baseASPD: 146, shieldPenalty:  -8, weapons: [0,9,10,16],               weaponFactors: {9:-3,10:-3,16:-10} },
  { label: "Ninja",          icon: "🌙",  baseASPD: 156, shieldPenalty:  -6, weapons: [0,1,17],                  weaponFactors: {1:-3,17:-15} },
  { label: "Gunslinger",     icon: "🔫",  baseASPD: 149, shieldPenalty: -50, weapons: [0,18,19,20,21,22],        weaponFactors: {18:5,19:-5,20:-40,21:0,22:-50} },
];

const WEAPONS: WeaponEntry[] = [
  { label: "No Weapon (Bare Hand)",  canOffHand: false },  // 0
  { label: "Dagger",                canOffHand: true  },  // 1
  { label: "One-Hand Sword",        canOffHand: true  },  // 2
  { label: "Two-Hand Sword",        canOffHand: false },  // 3
  { label: "One-Hand Spear",        canOffHand: false },  // 4
  { label: "Two-Hand Spear",        canOffHand: false },  // 5
  { label: "One-Hand Axe",          canOffHand: true  },  // 6
  { label: "Two-Hand Axe",          canOffHand: false },  // 7
  { label: "Mace",                  canOffHand: true  },  // 8
  { label: "One-Hand Staff / Rod",  canOffHand: true  },  // 9
  { label: "Two-Hand Staff",        canOffHand: false },  // 10
  { label: "Bow",                   canOffHand: false },  // 11
  { label: "Knuckle",               canOffHand: false },  // 12
  { label: "Katar",                 canOffHand: true  },  // 13
  { label: "Musical Instrument",    canOffHand: false },  // 14
  { label: "Whip",                  canOffHand: false },  // 15
  { label: "Book",                  canOffHand: true  },  // 16
  { label: "Huuma Shuriken",        canOffHand: false },  // 17
  { label: "Handgun",               canOffHand: false },  // 18
  { label: "Rifle",                 canOffHand: false },  // 19
  { label: "Shotgun",               canOffHand: false },  // 20
  { label: "Gatling Gun",           canOffHand: false },  // 21
  { label: "Grenade Launcher",      canOffHand: false },  // 22
];

// ─── Class Tier ───────────────────────────────────────────────────────────────

type ClassTier = "class12" | "extended" | "awakened";

interface ClassTierEntry {
  label: string;
  icon: string;
  maxASPD: number;
  available: boolean;
}

const CLASS_TIERS: Record<ClassTier, ClassTierEntry> = {
  class12:  { label: "Class 1–2",      icon: "⚔️",  maxASPD: 190, available: true  },
  extended: { label: "Extended Class",  icon: "🌟",  maxASPD: 193, available: true  },
  awakened: { label: "Awakened Class",  icon: "✨",  maxASPD: 193, available: false },
};

// Extended Class jobs (Super Extended Novice, Rebellion, Kagerou, Oboro)
const JOBS_EXTENDED: JobEntry[] = [
  { label: "Super Extended Novice", icon: "🧑‍🎓", baseASPD: 156, shieldPenalty: -10, weapons: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], weaponFactors: {1:-15,2:-17,3:-20,4:-17,5:-25,6:-10,7:-20,8:-10,9:-25,10:-25,11:-10,12:-20,13:-20,14:-10,15:-10,16:-10} },
  { label: "Rebellion",             icon: "🔫",  baseASPD: 154, shieldPenalty: -50, weapons: [0,18,19,20,21,22],        weaponFactors: {18:5,19:-5,20:-40,21:0,22:-50} },
  { label: "Kagerou",               icon: "🌙",  baseASPD: 156, shieldPenalty:  -6, weapons: [0,1,13,17],               weaponFactors: {1:-3,13:-2,17:-15} },
  { label: "Oboro",                 icon: "🌸",  baseASPD: 156, shieldPenalty:  -6, weapons: [0,1,13,17],               weaponFactors: {1:-3,13:-2,17:-15} },
];

// ─── Potion Data ─────────────────────────────────────────────────────────────

interface PotionOption {
  label: string;
  mod: number;        // decimal (0.10 = 10%)
  assassinOnly: boolean;
}

const POTIONS: PotionOption[] = [
  { label: "— ไม่ใช้ Potion —", mod: 0, assassinOnly: false },
  { label: "Concentration Potion  (+10%)", mod: 0.10, assassinOnly: false },
  { label: "Awakening Potion  (+15%)", mod: 0.15, assassinOnly: false },
  { label: "Berserk Potion  (+20%)", mod: 0.20, assassinOnly: false },
  { label: "Poison Bottle  (+20%) [AssX Only]", mod: 0.20, assassinOnly: true },
];

// ─── Formula ─────────────────────────────────────────────────────────────────

/**
 * Updated ASPD Formula (RO Classic):
 *
 * combinedBase  = JobBaseASPD + WeaponFactor   (treated as "Job Base ASPD")
 * aspdPenalty   = min(0.96, 1 − (combinedBase − 144) / 50)       [2 dec]
 * aspdCorrection= ceil((√205 − √AGI) / 7.15, 3 dec)              [3 dec]
 * inner         = combinedBase + ShieldPenalty − aspdCorrection
 *                 + √(AGI×9.999 + DEX×0.19212) × aspdPenalty
 * baseASPD      = floor(200 − (200 − inner) × (1 − potion − skill), 2 dec)
 * equipContrib  = floor((195 − baseASPD) × equipMod, 1 dec)
 * finalASPD     = floor(baseASPD + equipContrib + flatASPD), cap 193
 */
function calcASPD(
  jobBaseASPD: number,
  weaponFactor: number,
  shieldPenalty: number,
  agi: number,
  dex: number,
  potionMod: number,
  skillMod: number,
  equipMod: number,
  flatASPD: number,
  maxASPD = 193
): {
  combinedBase: number;
  aspdPenalty: number;
  aspdCorrection: number;
  inner: number;
  baseASPD: number;
  equipContrib: number;
  final: number;
} {
  const safeAgi = Math.max(0, agi);
  const safeDex = Math.max(0, dex);

  // Combined Job Base ASPD (job + weapon)
  const combinedBase = jobBaseASPD + weaponFactor;

  // ASPD Penalty — max 0.96, 2 decimals
  const penaltyRaw = 1 - (combinedBase - 144) / 50;
  const aspdPenalty = parseFloat(Math.min(0.96, penaltyRaw).toFixed(2));

  // ASPD Correction — round UP to 3 decimals
  const correctionRaw = (Math.sqrt(205) - Math.sqrt(safeAgi)) / 7.15;
  const aspdCorrection = parseFloat(
    (Math.ceil(correctionRaw * 1000) / 1000).toFixed(3)
  );

  // Inner stat term
  const statSqrt = Math.sqrt(safeAgi * 9.999 + safeDex * 0.19212);
  const inner = combinedBase + shieldPenalty - aspdCorrection + statSqrt * aspdPenalty;

  // Base ASPD — floor to 2 decimals
  const baseRaw = 200 - (200 - inner) * (1 - potionMod - skillMod);
  const baseASPD = parseFloat((Math.floor(baseRaw * 100) / 100).toFixed(2));

  // Equip ASPD contribution — floor to 1 decimal
  const equipRaw = (195 - baseASPD) * equipMod;
  const equipContrib = parseFloat((Math.floor(equipRaw * 10) / 10).toFixed(1));

  // Final ASPD — floor, cap maxASPD
  const final = Math.min(maxASPD, Math.max(0, Math.floor(baseASPD + equipContrib + flatASPD)));

  return { combinedBase, aspdPenalty, aspdCorrection, inner, baseASPD, equipContrib, final };
}

// ─── Reverse Calc ────────────────────────────────────────────────────────────
// Brute-force scan: how many +AGI / +DEX needed to reach a target final ASPD
function stepsToASPD(
  target: number,
  jobBaseASPD: number,
  weaponFactor: number,
  shieldPenalty: number,
  agi: number,
  dex: number,
  potionMod: number,
  skillMod: number,
  equipMod: number,
  flatASPD: number,
  maxASPD = 193
): { agiNeeded: number | null; dexNeeded: number | null } {
  const MAX_SCAN = 600;
  let agiNeeded: number | null = null;
  for (let extra = 1; extra <= MAX_SCAN; extra++) {
    const r = calcASPD(jobBaseASPD, weaponFactor, shieldPenalty, agi + extra, dex, potionMod, skillMod, equipMod, flatASPD, maxASPD);
    if (r.final >= target) { agiNeeded = extra; break; }
  }
  let dexNeeded: number | null = null;
  for (let extra = 1; extra <= MAX_SCAN; extra++) {
    const r = calcASPD(jobBaseASPD, weaponFactor, shieldPenalty, agi, dex + extra, potionMod, skillMod, equipMod, flatASPD, maxASPD);
    if (r.final >= target) { dexNeeded = extra; break; }
  }
  return { agiNeeded, dexNeeded };
}

// ─── Helper components ───────────────────────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-sky-300 tracking-widest uppercase">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="number"
          className="w-full rounded-lg bg-white/5 border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/30 transition-all pr-10"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
        />
        {suffix && (
          <span className="absolute right-3 text-xs text-white/40">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-white/30 leading-tight">{hint}</p>}
    </div>
  );
}

function SelectField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-sky-300 tracking-widest uppercase">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-white/30 leading-tight">{hint}</p>}
    </div>
  );
}

// Gauge ring component
function ASPDGauge({ aspd, max = 193 }: { aspd: number; max?: number }) {
  const pct = Math.min(1, Math.max(0, aspd / max));
  const r = 82;
  const sw = 12;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const gap = circ - dash;

  const hue = Math.round(pct * 120); // 0=red, 120=green
  const color = `hsl(${hue}, 95%, 60%)`;

  const attacksPerSec = aspd > 0 && aspd < 200 ? (50 / (200 - aspd)).toFixed(2) : "—";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <defs>
            <filter id="glow-arc" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={sw}
            strokeLinecap="butt"
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            filter="url(#glow-arc)"
            style={{
              transition: "stroke-dasharray 0.4s ease, stroke 0.4s ease",
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-black tabular-nums"
            style={{ color, textShadow: `0 0 18px ${color}` }}
          >
            {aspd}
          </span>
          <span className="text-xs font-semibold tracking-widest text-white/30 uppercase mt-1">
            ASPD
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-white/50">
          ⚡{" "}
          <span className="font-bold text-white">{attacksPerSec}</span>{" "}
          attacks/sec
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AspdCalcPage() {
  const [jobIdx, setJobIdx] = useState(2); // Knight default
  const [weaponIdx, setWeaponIdx] = useState(3); // 2H Sword default
  const [offHand, setOffHand] = useState("none"); // "none" | "shield" | "w:{idx}"
  const [agi, setAgi] = useState(90);
  const [dex, setDex] = useState(30);
  const [potionIdx, setPotionIdx] = useState(0);
  const [skillPct, setSkillPct] = useState(0);
  const [equipPct, setEquipPct] = useState(0);
  const [flatASPD, setFlatASPD] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  const [targetASPD, setTargetASPD] = useState(190);
  const [classTier, setClassTier] = useState<ClassTier>("class12");

  const currentJobs = classTier === "extended" ? JOBS_EXTENDED : JOBS;
  const maxASPD = CLASS_TIERS[classTier].maxASPD;
  const job = currentJobs[Math.min(jobIdx, currentJobs.length - 1)];
  const safeWeaponIdx = job.weapons.includes(weaponIdx) ? weaponIdx : (job.weapons[0] ?? 0);
  const weapon = WEAPONS[safeWeaponIdx];
  const weaponFactor = job.weaponFactors[safeWeaponIdx] ?? 0;
  const potion = POTIONS[potionIdx];
  const offHandFactor =
    offHand === "shield" ? job.shieldPenalty :
    offHand.startsWith("w:") ? (job.weaponFactors[parseInt(offHand.slice(2))] ?? 0) :
    0;
  const offHandLabel =
    offHand === "none" ? "—" :
    offHand === "shield" ? `Shield (${job.shieldPenalty})` :
    WEAPONS[parseInt(offHand.slice(2))].label;

  const isAssassinCross = job.label.includes("Assassin");
  const isPoisonBottle = potion.assassinOnly;
  const poisonWarning = isPoisonBottle && !isAssassinCross;

  const result = useMemo(
    () =>
      calcASPD(
        job.baseASPD,
        weaponFactor,
        offHandFactor,
        agi,
        dex,
        poisonWarning ? 0 : potion.mod,
        skillPct / 100,
        equipPct / 100,
        flatASPD,
        maxASPD
      ),
    [
      job.baseASPD,
      weaponFactor,
      offHandFactor,
      agi,
      dex,
      potion.mod,
      poisonWarning,
      skillPct,
      equipPct,
      flatASPD,
      maxASPD,
    ]
  );

  const aspdColor = result.final >= 170 ? "text-green-400" :
                    result.final >= 140 ? "text-yellow-400" : "text-red-400";

  const reverseCalc = useMemo(() =>
    stepsToASPD(
      targetASPD,
      job.baseASPD, weaponFactor, offHandFactor,
      agi, dex,
      poisonWarning ? 0 : potion.mod,
      skillPct / 100, equipPct / 100, flatASPD, maxASPD
    ),
    [targetASPD, job.baseASPD, weaponFactor, offHandFactor, agi, dex, potion.mod, poisonWarning, skillPct, equipPct, flatASPD, maxASPD]
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "linear-gradient(135deg, #020818 0%, #061030 40%, #0a0520 100%)",
      }}
    >
      {/* Header */}
      <div className="relative overflow-hidden pb-1">
        {/* Lightning bg effect */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-30deg, #00bfff 0px, #00bfff 1px, transparent 1px, transparent 18px)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center pt-10 pb-6 px-4 text-center">
          <div className="mb-1 text-4xl">⚡</div>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-widest uppercase"
            style={{
              color: "#38bdf8",
              textShadow: "0 0 20px #38bdf8, 0 0 50px #0ea5e9",
            }}
          >
            The Flash Calc
          </h1>
          <p
            className="mt-2 text-base font-bold tracking-[0.3em] uppercase"
            style={{ color: "#7dd3fc" }}
          >
            ASPD Calculator
          </p>
          <p className="mt-1 text-xs text-white/30 tracking-widest">
            Ragnarok Online Classic
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left: Inputs ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Job & Weapon Card */}
            <div
              className="rounded-2xl border border-sky-500/20 p-5 space-y-4"
              style={{ background: "rgba(10,20,50,0.8)" }}
            >
              <h2 className="text-sm font-bold text-sky-400 tracking-widest uppercase border-b border-sky-500/20 pb-2">
                ⚙️ Job &amp; Equipment
              </h2>

              <SelectField label="Class Tier">
                <select
                  className="w-full rounded-lg bg-white/5 border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-sky-400/60 transition-all"
                  value={classTier}
                  onChange={(e) => {
                    const newTier = e.target.value as ClassTier;
                    const jobs = newTier === "extended" ? JOBS_EXTENDED : JOBS;
                    const firstJob = jobs[0];
                    setClassTier(newTier);
                    setJobIdx(0);
                    if (firstJob && !firstJob.weapons.includes(weaponIdx)) {
                      setWeaponIdx(firstJob.weapons[0] ?? 0);
                    }
                  }}
                >
                  <option value="class12" className="bg-gray-900 text-white">⚔️ Class 1–2 (Max ASPD 190)</option>
                  <option value="extended" className="bg-gray-900 text-white">🌟 Extended Class (Max ASPD 193)</option>
                  <option value="awakened" className="bg-gray-900 text-white">✨ Awakened Class (Coming Soon)</option>
                </select>
              </SelectField>

              {classTier === "awakened" ? (
                <div className="flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-5">
                  <span className="text-3xl">🚧</span>
                  <div>
                    <p className="text-sm font-bold text-yellow-400">Coming Soon</p>
                    <p className="text-xs text-white/40 mt-0.5">ยังไม่มีข้อมูล ASPD สำหรับ Awakened Class</p>
                  </div>
                </div>
              ) : (
                <>
                  <SelectField label="Job Class">
                    <select
                      className="w-full rounded-lg bg-white/5 border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-sky-400/60 transition-all"
                      value={jobIdx}
                      onChange={(e) => {
                        const newIdx = Number(e.target.value);
                        const newJob = currentJobs[Math.min(newIdx, currentJobs.length - 1)];
                        setJobIdx(newIdx);
                        if (newJob && !newJob.weapons.includes(weaponIdx)) {
                          setWeaponIdx(newJob.weapons[0] ?? 0);
                        }
                      }}
                    >
                      {currentJobs.map((j, i) => (
                        <option
                          key={i}
                          value={i}
                          className="bg-gray-900 text-white"
                        >
                          {j.icon} {j.label}
                        </option>
                      ))}
                    </select>
                  </SelectField>

                  <SelectField
                    label="Weapon Type"
                    hint={`Weapon factor: ${weaponFactor >= 0 ? '+' : ''}${weaponFactor}`}
                  >
                    <select
                      className="w-full rounded-lg bg-white/5 border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-sky-400/60 transition-all"
                      value={safeWeaponIdx}
                      onChange={(e) => setWeaponIdx(Number(e.target.value))}
                    >
                      {WEAPONS.map((w, i) => job.weapons.includes(i) ? (
                        <option
                          key={i}
                          value={i}
                          className="bg-gray-900 text-white"
                        >
                          {w.label} {job.weaponFactors[i] !== undefined ? `(${job.weaponFactors[i] >= 0 ? '+' : ''}${job.weaponFactors[i]})` : ""}
                        </option>
                      ) : null)}
                    </select>
                  </SelectField>

                  <SelectField
                    label="Off-Hand"
                    hint={`Off-hand penalty: ${offHandFactor}`}
                  >
                    <select
                      className="w-full rounded-lg bg-white/5 border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-sky-400/60 transition-all"
                      value={offHand}
                      onChange={(e) => setOffHand(e.target.value)}
                    >
                      <option value="none" className="bg-gray-900 text-white">— ว่าง (ไม่ใส่) —</option>
                      <option value="shield" className="bg-gray-900 text-white">🛡️ Shield ({job.shieldPenalty})</option>
                      <optgroup label="⚔️ Dual Wield" className="bg-gray-900 text-white/60">
                        {WEAPONS.map((w, idx) => (w.canOffHand && job.weapons.includes(idx)) ? (
                          <option key={idx} value={`w:${idx}`} className="bg-gray-900 text-white">{w.label}</option>
                        ) : null)}
                      </optgroup>
                    </select>
                  </SelectField>
                </>
              )}
            </div>

            {/* Stats Card */}
            <div
              className="rounded-2xl border border-sky-500/20 p-5 space-y-4"
              style={{ background: "rgba(10,20,50,0.8)" }}
            >
              <h2 className="text-sm font-bold text-sky-400 tracking-widest uppercase border-b border-sky-500/20 pb-2">
                📊 Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="AGI"
                  value={agi}
                  onChange={setAgi}
                  min={1}
                  max={999}
                  hint="Agility stat (total with bonuses)"
                />
                <InputField
                  label="DEX"
                  value={dex}
                  onChange={setDex}
                  min={1}
                  max={999}
                  hint="Dexterity stat (total with bonuses)"
                />
              </div>
            </div>

            {/* Bonus Card */}
            <div
              className="rounded-2xl border border-sky-500/20 p-5 space-y-4"
              style={{ background: "rgba(10,20,50,0.8)" }}
            >
              <h2 className="text-sm font-bold text-sky-400 tracking-widest uppercase border-b border-sky-500/20 pb-2">
                ✨ ASPD Bonuses
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Potion Dropdown */}
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs font-bold text-sky-300 tracking-widest uppercase">
                    Potion ASPD
                  </label>
                  <select
                    className="w-full rounded-lg bg-white/5 border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-sky-400/60 transition-all"
                    value={potionIdx}
                    onChange={(e) => setPotionIdx(Number(e.target.value))}
                  >
                    {POTIONS.map((p, i) => (
                      <option key={i} value={i} className="bg-gray-900 text-white">
                        {p.label}
                      </option>
                    ))}
                  </select>
                  {/* Poison Bottle warning */}
                  {poisonWarning && (
                    <div className="flex items-start gap-2 mt-1 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/40">
                      <span className="text-red-400 text-sm leading-none mt-0.5">⚠️</span>
                      <p className="text-xs text-red-300 leading-snug">
                        <span className="font-bold">Poison Bottle</span> ใช้ได้เฉพาะ{" "}
                        <span className="font-bold text-red-200">Assassin Cross</span> เท่านั้น!
                        Class อื่นจะ <span className="font-bold text-red-200">ตายทันที</span> — ไม่คำนวณ Potion ASPD
                      </p>
                    </div>
                  )}
                  {!poisonWarning && potion.assassinOnly && (
                    <p className="text-xs text-green-400/70">
                      ✅ Assassin Cross สามารถใช้ Poison Bottle ได้
                    </p>
                  )}
                </div>

                <InputField
                  label="Skill ASPD"
                  value={skillPct}
                  onChange={setSkillPct}
                  min={0}
                  max={100}
                  step={1}
                  suffix="%"
                  hint="เช่น Two-Hand Quicken, Adrenaline Rush"
                />
                <InputField
                  label="Equip ASPD Mod"
                  value={equipPct}
                  onChange={setEquipPct}
                  min={0}
                  max={100}
                  step={1}
                  suffix="%"
                  hint="% ASPD จาก Equipment / Card"
                />
                <InputField
                  label="Flat ASPD"
                  value={flatASPD}
                  onChange={setFlatASPD}
                  min={0}
                  max={50}
                  hint="+ASPD แบบ flat จาก gear"
                />
              </div>
            </div>
          </div>

          {/* ── Right: Result Panel ── */}
          <div className="space-y-4">
            {/* ASPD Result */}
            <div
              className="rounded-2xl border border-sky-500/30 p-5 flex flex-col items-center gap-4"
              style={{
                background: "rgba(10,20,50,0.9)",
                boxShadow: "0 0 40px rgba(56,189,248,0.08)",
              }}
            >
              <h2 className="text-sm font-bold text-sky-400 tracking-widest uppercase self-start">
                ⚡ Result
              </h2>

              {classTier === "awakened" ? (
                <div className="w-52 h-52 flex flex-col items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/5">
                  <span className="text-4xl">🚧</span>
                  <p className="text-sm font-bold text-yellow-400 mt-2">Coming Soon</p>
                </div>
              ) : (
                <ASPDGauge aspd={result.final} max={maxASPD} />
              )}

              {/* Breakdown */}
              <div className="w-full space-y-2 text-xs border-t border-white/10 pt-3">
                {/* Input row */}
                <div className="flex justify-between">
                  <span className="text-white/40">Job Base ASPD</span>
                  <span className="text-white font-mono">{job.baseASPD}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Weapon Factor</span>
                  <span className="text-white font-mono">{weaponFactor >= 0 ? '+' : ''}{weaponFactor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Combined Base</span>
                  <span className="text-yellow-300 font-mono font-bold">{result.combinedBase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Off-Hand</span>
                  <span className="text-white font-mono">{offHandFactor !== 0 ? offHandFactor : "—"}</span>
                </div>

                {/* Computed intermediates */}
                <div className="border-t border-white/10 pt-2 space-y-1.5">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Computed</p>
                  <div className="flex justify-between">
                    <span className="text-white/50">ASPD Penalty</span>
                    <span className="text-orange-300 font-mono font-bold">{result.aspdPenalty.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">ASPD Correction</span>
                    <span className="text-orange-300 font-mono font-bold">{result.aspdCorrection.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Base ASPD</span>
                    <span className="text-sky-300 font-mono font-bold">{result.baseASPD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Equip ASPD %</span>
                    <span className="text-sky-300 font-mono">+{result.equipContrib.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Flat ASPD</span>
                    <span className="text-white/60 font-mono">+{flatASPD}</span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-white/70 font-bold text-sm">Final ASPD</span>
                  <span className={`font-mono font-black text-base ${aspdColor}`}>
                    {result.final}
                  </span>
                </div>
              </div>

              {/* Tier badge */}
              <div
                className={`w-full text-center py-2 rounded-lg text-sm font-bold tracking-widest uppercase border
                  ${result.final >= 185
                    ? "border-green-500/50 bg-green-500/10 text-green-400"
                    : result.final >= 170
                    ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                    : result.final >= 150
                    ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                    : "border-red-500/50 bg-red-500/10 text-red-400"
                  }`}
              >
                {result.final >= 185
                  ? "⚡ Lightning Fast"
                  : result.final >= 170
                  ? "🔥 Very Fast"
                  : result.final >= 150
                  ? "✅ Normal"
                  : "🐢 Slow"}
              </div>
            </div>

            {/* ── Reverse Calc ── */}
            <div
              className="rounded-2xl border border-purple-500/30 p-4 space-y-3"
              style={{ background: "rgba(20,10,50,0.9)" }}
            >
              <h3 className="text-xs font-bold text-purple-400 tracking-widest uppercase">
                🎯 เพิ่มอีกเท่าไหร่ถึง ASPD ที่ต้องการ?
              </h3>
              <div className="flex items-center gap-3">
                <label className="text-xs text-white/50 whitespace-nowrap">Target ASPD</label>
                <input
                  type="number"
                  min={1}
                  max={maxASPD}
                  value={targetASPD}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v)) setTargetASPD(Math.min(maxASPD, Math.max(1, v)));
                  }}
                  className="w-24 rounded-lg bg-white/5 border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-purple-400/60 transition-all"
                />
              </div>

              {result.final >= targetASPD ? (
                <p className="text-green-400 text-xs font-bold">✅ ถึง {targetASPD} แล้ว! (current: {result.final})</p>
              ) : (
                <div className="space-y-2 text-xs">
                  <p className="text-white/40">
                    จาก{" "}
                    <span className="text-white font-mono">{result.final}</span>
                    {" → "}
                    <span className="text-purple-300 font-mono font-bold">{targetASPD}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white/5 p-3 text-center border border-green-500/20">
                      <p className="text-white/40 mb-1 text-xs">เพิ่ม AGI</p>
                      {reverseCalc.agiNeeded !== null ? (
                        <>
                          <p className="text-green-400 font-mono font-black text-2xl">+{reverseCalc.agiNeeded}</p>
                          <p className="text-white/30 text-xs mt-1">{agi} → {agi + reverseCalc.agiNeeded}</p>
                        </>
                      ) : (
                        <p className="text-red-400 font-mono text-sm mt-2">ไม่พอ ❌</p>
                      )}
                    </div>
                    <div className="rounded-lg bg-white/5 p-3 text-center border border-blue-500/20">
                      <p className="text-white/40 mb-1 text-xs">เพิ่ม DEX</p>
                      {reverseCalc.dexNeeded !== null ? (
                        <>
                          <p className="text-blue-400 font-mono font-black text-2xl">+{reverseCalc.dexNeeded}</p>
                          <p className="text-white/30 text-xs mt-1">{dex} → {dex + reverseCalc.dexNeeded}</p>
                        </>
                      ) : (
                        <p className="text-red-400 font-mono text-sm mt-2">ไม่พอ ❌</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stat summary */}
            <div
              className="rounded-2xl border border-white/10 p-4 space-y-2 text-xs"
              style={{ background: "rgba(10,20,50,0.7)" }}
            >
              <h3 className="text-xs font-bold text-white/50 tracking-widest uppercase">
                Input Summary
              </h3>
              {[
                ["Job", `${job.icon} ${job.label}`],
                ["Weapon", weapon.label],
                ["Off-Hand", offHandLabel],
                ["AGI / DEX", `${agi} / ${dex}`],
                ["Potion", potion.mod > 0 ? `${potion.mod * 100}%${poisonWarning ? " ⚠️" : ""}` : "—"],
                ["Skill ASPD", `${skillPct}%`],
                ["Equip ASPD", `${equipPct}%`],
                ["Flat ASPD", `+${flatASPD}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-white/40">{k}</span>
                  <span className="text-white/70 font-medium text-right max-w-[55%] truncate">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formula accordion */}
        <div className="mt-6">
          <button
            onClick={() => setShowFormula((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 rounded-xl border border-sky-500/20 text-sm font-bold text-sky-400 tracking-widest uppercase transition-colors hover:bg-sky-500/5"
            style={{ background: "rgba(10,20,50,0.8)" }}
          >
            <span>📐 ASPD Formula</span>
            <span className="text-white/40">{showFormula ? "▲" : "▼"}</span>
          </button>

          {showFormula && (
            <div
              className="mt-1 rounded-b-xl border border-t-0 border-sky-500/20 px-5 py-5 space-y-5"
              style={{ background: "rgba(8,16,42,0.95)" }}
            >
              {/* Step-by-step formula */}
              <div className="space-y-4 text-xs font-mono">

                {/* Step 1 */}
                <div>
                  <p className="text-sky-400 font-bold text-sm mb-2">① ASPD Penalty</p>
                  <div className="pl-3 border-l-2 border-sky-500/30 space-y-1 text-white/70">
                    <p className="text-yellow-300">= [ 1 − &#123; Job Base ASPD − 144 &#125; ÷ 50 ]</p>
                    <p className="text-white/40">Note: จำกัดสูงสุดที่ 0.96 | แสดง 2 ตำแหน่ง</p>
                    <p className="text-orange-300 font-bold">
                      = [ 1 − &#123; {result.combinedBase} − 144 &#125; ÷ 50 ]
                      {" "}= <span className="text-white">{(1 - (result.combinedBase - 144) / 50).toFixed(3)}</span>
                      {" "}→ <span className="text-orange-200">{result.aspdPenalty.toFixed(2)}</span>
                      {(1 - (result.combinedBase - 144) / 50) > 0.96 ? " (capped at 0.96)" : ""}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <p className="text-sky-400 font-bold text-sm mb-2">② ASPD Correction</p>
                  <div className="pl-3 border-l-2 border-sky-500/30 space-y-1 text-white/70">
                    <p className="text-yellow-300">= [ &#123; √205 − √AGI &#125; ÷ 7.15 ]</p>
                    <p className="text-white/40">Note: ปัดขึ้น 3 ตำแหน่ง</p>
                    <p className="text-orange-300 font-bold">
                      = [ &#123; √205 − √{agi} &#125; ÷ 7.15 ]
                      {" "}= <span className="text-white">{((Math.sqrt(205) - Math.sqrt(agi)) / 7.15).toFixed(5)}</span>
                      {" "}→ <span className="text-orange-200">{result.aspdCorrection.toFixed(3)}</span>
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <p className="text-sky-400 font-bold text-sm mb-2">③ Base ASPD</p>
                  <div className="pl-3 border-l-2 border-sky-500/30 space-y-1 text-white/70">
                    <p className="text-yellow-300 leading-relaxed">
                      = [ 200 − &#123; 200 − ( Job Base ASPD + Off-Hand Factor<br/>
                      &nbsp;&nbsp;&nbsp;− ASPD Correction + √[ AGI×9.999 + DEX×0.19212 ] × ASPD Penalty )<br/>
                      &nbsp;&nbsp;&#125; × &#123; 1 − Potion Mod − Skill Mod &#125; ]
                    </p>
                    <p className="text-white/40">Note: ปัดลง 2 ตำแหน่ง</p>
                    <p className="text-sky-300 font-bold">
                      inner = {result.combinedBase} + {offHandFactor} − {result.aspdCorrection.toFixed(3)}
                      {" "}+ √({agi}×9.999 + {dex}×0.19212) × {result.aspdPenalty.toFixed(2)}
                      {" "}= <span className="text-white">{result.inner.toFixed(4)}</span>
                    </p>
                    <p className="text-sky-300 font-bold">
                      Base ASPD = 200 − (200 − {result.inner.toFixed(3)}) × (1 − {(poisonWarning ? 0 : potion.mod)} − {(skillPct / 100).toFixed(2)})
                      {" "}→ <span className="text-sky-200">{result.baseASPD.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div>
                  <p className="text-sky-400 font-bold text-sm mb-2">④ Equip ASPD %</p>
                  <div className="pl-3 border-l-2 border-sky-500/30 space-y-1 text-white/70">
                    <p className="text-yellow-300">= [ &#123; 195 − Base ASPD &#125; × Equip ASPD Mod ]</p>
                    <p className="text-white/40">Note: ปัดลง 1 ตำแหน่ง</p>
                    <p className="text-sky-300 font-bold">
                      = (195 − {result.baseASPD.toFixed(2)}) × {(equipPct / 100).toFixed(2)}
                      {" "}= <span className="text-white">{((195 - result.baseASPD) * (equipPct / 100)).toFixed(4)}</span>
                      {" "}→ <span className="text-sky-200">{result.equipContrib.toFixed(1)}</span>
                    </p>
                  </div>
                </div>

                {/* Final */}
                <div className="border-t border-white/10 pt-3">
                  <p className="text-green-400 font-bold text-sm mb-1">⚡ Final ASPD</p>
                  <p className="text-white/70">
                    = floor( Base ASPD + Equip ASPD % + Flat ASPD ) , max {maxASPD}
                  </p>
                  <p className="text-green-300 font-bold text-base mt-1">
                    = floor( {result.baseASPD.toFixed(2)} + {result.equipContrib.toFixed(1)} + {flatASPD} )
                    {" "}= <span className="text-green-200 text-lg">{result.final}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
