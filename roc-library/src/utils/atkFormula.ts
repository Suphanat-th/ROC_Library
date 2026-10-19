import type { AtkInput, AtkResult } from "@/app/atk-calc/types";

// Indexed by weapon level (WLv 1-4), from the ATK basics video.
const REFINE_ATK: Record<number, number> = { 1: 2, 2: 3, 3: 5, 4: 7 };
const OVERREFINE_FACTOR: Record<number, number> = { 1: 3, 2: 5, 3: 8, 4: 14 };
// Safe refine limit per weapon level (classic values; only WLv4 is confirmed by the video example).
const SAFE_REFINE: Record<number, number> = { 1: 7, 2: 6, 3: 5, 4: 4 };

export const DEFAULT_ATK_INPUT: AtkInput = {
  range: "melee",
  baseLevel: 1,
  strBase: 1,
  strBonus: 0,
  dexBase: 1,
  dexBonus: 0,
  lukBase: 1,
  lukBonus: 0,
  weaponAtk: 0,
  weaponLevel: 1,
  refine: 0,
  maxVariance: false,
  equipAtk: 0,
  masteryAtk: 0,
  atkPct: 0,
  racePct: 0,
  sizePct: 0,
  elementPct: 0,
  typePct: 0,
  rangePct: 0,
  critPct: 0,
  skillPct: 100,
  def: 0,
};

// Melee uses STR as the main stat, ranged weapons swap STR and DEX.
export function calcStatusAtk(
  range: AtkInput["range"],
  baseLevel: number,
  str: number,
  dex: number,
  luk: number,
): number {
  const main = range === "melee" ? str : dex;
  const sub = range === "melee" ? dex : str;
  // Terms are summed with their decimals and rounded down once, which matches
  // the Status ATK shown by the game's stat window.
  return Math.floor(baseLevel / 4 + main + sub / 5 + luk / 3);
}

// Every step after Status ATK is rounded down immediately.
// DEF is intentionally not applied yet.
export function calcATK(input: AtkInput): AtkResult {
  const str = input.strBase + input.strBonus;
  const dex = input.dexBase + input.dexBonus;
  const luk = input.lukBase + input.lukBonus;
  const wlv = Math.min(4, Math.max(1, Math.floor(input.weaponLevel)));

  const statusAtk = calcStatusAtk(input.range, input.baseLevel, str, dex, luk);

  // Weapon ATK = Base + Bonus STR/DEX + Variance + Refine + Overrefine
  const mainStat = input.range === "melee" ? str : dex;
  const bonusStat = Math.floor((mainStat * input.weaponAtk) / 200);
  const variance = Math.floor(0.05 * wlv * input.weaponAtk);
  const refineBonus = input.refine * REFINE_ATK[wlv];
  const over = Math.max(0, input.refine - SAFE_REFINE[wlv]);
  const overrefineMin = over > 0 ? 1 : 0;
  const overrefineMax = OVERREFINE_FACTOR[wlv] * over;

  const common = input.weaponAtk + bonusStat + refineBonus;
  const weaponMax = common + variance + overrefineMax;
  const weaponMin =
    common + (input.maxVariance ? variance : -variance) + overrefineMin;

  const pct = (v: number) => 1 + v / 100;
  const level2Pcts = [
    input.racePct,
    input.sizePct,
    input.elementPct,
    input.typePct,
  ];
  const level2 = level2Pcts.reduce((m, v) => m * pct(v), 1);
  const level3Pcts = [input.rangePct, input.critPct];
  const level3 = level3Pcts.reduce((m, v) => m * pct(v), 1);

  const mulFloor = (value: number, pcts: number[]) =>
    pcts.reduce((v, p) => Math.floor(v * pct(p)), value);

  const stage = (weapon: number) => {
    const base = weapon + input.equipAtk;
    const a =
      mulFloor(base, level2Pcts) + Math.floor((base * input.atkPct) / 100);
    const b = a + statusAtk * 2 + input.masteryAtk;
    return { a, b, final: mulFloor(b, level3Pcts) };
  };
  const lo = stage(weaponMin);
  const hi = stage(weaponMax);

  const withSkill = (v: number) => Math.floor((v * input.skillPct) / 100);
  const min = withSkill(lo.final);
  const max = withSkill(hi.final);

  return {
    statusAtk,
    bonusStat,
    weaponMin,
    weaponMax,
    refineBonus,
    overrefineMin,
    overrefineMax,
    level2,
    aMin: lo.a,
    aMax: hi.a,
    bMin: lo.b,
    bMax: hi.b,
    level3,
    finalMin: lo.final,
    finalMax: hi.final,
    min,
    max,
    avg: Math.floor((min + max) / 2),
  };
}
