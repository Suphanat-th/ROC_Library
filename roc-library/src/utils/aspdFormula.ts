import type {
  AspdCalculationResult,
  ReverseCalcResult,
} from "@/app/aspd-calc/types";

function roundDown(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.floor(value * factor) / factor;
}

function roundUp(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.ceil(value * factor) / factor;
}

export function calculateJobWeaponBase(jobBaseASPD: number, weaponFactor: number) {
  return jobBaseASPD + weaponFactor;
}

export function calculateAspdPenalty(jobWeaponBase: number) {
  const penalty = 1 - ((jobWeaponBase - 144) / 50);
  return roundDown(Math.min(0.96, penalty), 2);
}

export function calculateAspdCorrection(agi: number) {
  return roundUp((Math.sqrt(205) - Math.sqrt(Math.max(0, agi))) / 7.15, 3);
}

export function calculateStatTerm(agi: number, dex: number) {
  return Math.sqrt(Math.max(0, agi) * 9.999 + Math.max(0, dex) * 0.19212);
}

export function calculateBaseCase(
  jobWeaponBase: number,
  shieldPenalty: number,
  aspdCorrection: number,
  statTerm: number,
  aspdPenalty: number,
) {
  return jobWeaponBase + shieldPenalty - aspdCorrection + statTerm * aspdPenalty;
}

export function calculateBaseASPD(baseCase: number, totalModifier: number) {
  return roundDown(200 - (200 - baseCase) * (1 - totalModifier), 2);
}

export function calculateEquipContribution(baseASPD: number, equipMod: number) {
  return roundDown((195 - baseASPD) * equipMod, 1);
}

export function calculateFinalRaw(baseASPD: number, equipContrib: number, flatASPD: number) {
  return baseASPD + equipContrib + flatASPD;
}

export function calcASPD(
  jobBaseASPD: number,
  weaponFactor: number,
  shieldPenalty: number,
  agi: number,
  dex: number,
  potionMod: number,
  skillMod: number,
  specialMod: number,
  equipMod: number,
  flatASPD: number,
  maxASPD = 193,
): AspdCalculationResult {
  const jobWeaponBase = calculateJobWeaponBase(jobBaseASPD, weaponFactor);
  const aspdPenalty = calculateAspdPenalty(jobWeaponBase);
  const aspdCorrection = calculateAspdCorrection(agi);
  const statTerm = calculateStatTerm(agi, dex);
  const baseCase = calculateBaseCase(
    jobWeaponBase,
    shieldPenalty,
    aspdCorrection,
    statTerm,
    aspdPenalty,
  );

  const bonusTotal = potionMod + skillMod + specialMod;
  const baseASPD = calculateBaseASPD(baseCase, bonusTotal);
  const equipContrib = calculateEquipContribution(baseASPD, equipMod);
  const afterEquipASPD = baseASPD + equipContrib;
  const finalRaw = calculateFinalRaw(baseASPD, equipContrib, flatASPD);
  const final = Math.min(maxASPD, Math.max(0, Math.floor(finalRaw)));

  return {
    jobWeaponBase,
    aspdPenalty,
    aspdCorrection,
    statTerm,
    baseCase,
    bonusTotal,
    baseASPD,
    equipContrib,
    afterEquipASPD,
    finalRaw,
    final,
  };
}

export function stepsToASPD(
  target: number,
  jobBaseASPD: number,
  weaponFactor: number,
  shieldPenalty: number,
  agi: number,
  dex: number,
  potionMod: number,
  skillMod: number,
  specialMod: number,
  equipMod: number,
  flatASPD: number,
  maxASPD = 193,
): ReverseCalcResult {
  const maxScan = 600;

  let agiNeeded: number | null = null;
  for (let extra = 1; extra <= maxScan; extra += 1) {
    const result = calcASPD(
      jobBaseASPD,
      weaponFactor,
      shieldPenalty,
      agi + extra,
      dex,
      potionMod,
      skillMod,
      specialMod,
      equipMod,
      flatASPD,
      maxASPD,
    );

    if (result.final >= target) {
      agiNeeded = extra;
      break;
    }
  }

  let dexNeeded: number | null = null;
  for (let extra = 1; extra <= maxScan; extra += 1) {
    const result = calcASPD(
      jobBaseASPD,
      weaponFactor,
      shieldPenalty,
      agi,
      dex + extra,
      potionMod,
      skillMod,
      specialMod,
      equipMod,
      flatASPD,
      maxASPD,
    );

    if (result.final >= target) {
      dexNeeded = extra;
      break;
    }
  }

  return { agiNeeded, dexNeeded };
}