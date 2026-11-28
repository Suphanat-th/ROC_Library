import { attacksPerSecond } from "./aspdFormula";

export type CastInput = {
  fixedCast: number; // seconds
  fixedReductionSeconds: number; // seconds, taken off first
  fixedReduction: number; // %, the highest single one; applied to what is left
  baseVct: number; // seconds
  vctReductionSeconds: number; // seconds, taken off first
  dex: number; // the number before the "+" in the game's status window
  dexBonus: number; // the number after the "+"
  int: number; // the number before the "+"
  intBonus: number; // the number after the "+"
  gearVctReduction: number; // %, sum of gear and cards
  skillVctReduction: number; // %, sum of skills
  globalCd: number; // seconds
  globalCdReduction: number; // %
  aspd: number;
  skillCd: number; // seconds
  skillCdReductionSeconds: number; // seconds, taken off first
  skillCdReduction: number; // %, applied to what is left
};

export type CastResult = {
  fixedAfterSeconds: number; // Fixed cast once the seconds reduction is taken off
  fixed: number;
  vctAfterSeconds: number; // Base VCT once the seconds reduction is taken off
  vctAfterStats: number; // ... once DEX/INT have shortened it
  vctAfterGear: number; // ... and then the gear %
  vct: number;
  statMultiplier: number;
  statPoints: number; // DEX x 2 + INT
  statPointsMissing: number; // points still needed for DEX/INT alone to cancel VCT
  aspdDelay: number;
  globalCd: number; // Global CD after its % reduction
  wait: number; // the wait after the cast: the longer of Global CD and the ASPD delay
  waitSource: "global" | "aspd";
  aspdNeeded: number; // lowest ASPD at which ASPD stops being the bottleneck (0 when it is not)
  aspdMissing: number;
  skillCdAfterSeconds: number; // Skill CD once the seconds reduction is taken off
  skillCd: number;
  castEnd: number; // when the cast finishes: Fixed cast + VCT
  total: number; // when any other skill can be used: cast + wait
  reuse: number; // when the same skill can be used again: cast + the longer of wait and Skill CD
  castsPerSecond: number; // how many times a second the same skill can be used over and over
};

/** Highest ASPD a character can reach in the game (the ASPD calculator's cap for Extended and Awakened). */
export const MAX_ASPD = 193;
/** The ASPD at which the attack interval would be 0; the interval is (this − ASPD) / 50 seconds. */
const ASPD_ZERO = 200;
/** DEX x 2 + INT at which DEX/INT alone cancel all of the VCT. */
export const VCT_STAT_CAP = 530;

const pct = (value: number) => Math.min(Math.max(value, 0), 100);
const nonNeg = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : 0);

export function calcCast(input: CastInput): CastResult {
  const fixedAfterSeconds = Math.max(nonNeg(input.fixedCast) - nonNeg(input.fixedReductionSeconds), 0);
  const fixed = fixedAfterSeconds * (1 - pct(input.fixedReduction) / 100);

  const statPoints = (nonNeg(input.dex) + nonNeg(input.dexBonus)) * 2 + nonNeg(input.int) + nonNeg(input.intBonus);
  const statMultiplier = Math.max(1 - Math.sqrt(statPoints / VCT_STAT_CAP), 0);
  const vctAfterSeconds = Math.max(nonNeg(input.baseVct) - nonNeg(input.vctReductionSeconds), 0);
  const vctAfterStats = vctAfterSeconds * statMultiplier;
  const vctAfterGear = vctAfterStats * (1 - pct(input.gearVctReduction) / 100);
  const vct = vctAfterGear * (1 - pct(input.skillVctReduction) / 100);

  const aspd = Math.min(nonNeg(input.aspd), MAX_ASPD);
  const aspdDelay = (ASPD_ZERO - aspd) / 50;
  const globalCd = nonNeg(input.globalCd) * (1 - pct(input.globalCdReduction) / 100);
  // An estimate, not confirmed by the game: ASPD sets a floor under the Global CD.
  const waitSource = globalCd >= aspdDelay ? "global" : "aspd";
  const wait = Math.max(globalCd, aspdDelay);

  // ASPD that brings its delay down to the Global CD (or as low as it can go when the skill has none),
  // never more than the highest ASPD there is.
  const aspdNeeded = waitSource === "aspd" ? Math.min(Math.ceil(ASPD_ZERO - globalCd * 50), MAX_ASPD) : 0;

  const skillCdAfterSeconds = Math.max(nonNeg(input.skillCd) - nonNeg(input.skillCdReductionSeconds), 0);
  const skillCd = skillCdAfterSeconds * (1 - pct(input.skillCdReduction) / 100);

  // Global CD and Skill CD both start the moment the cast finishes.
  const castEnd = fixed + vct;

  const reuse = castEnd + Math.max(wait, skillCd);
  // When nothing but ASPD sets the time between uses, count it the way the ASPD calculator does (190 is 5 a second,
  // 193 is 7); otherwise it is one use per round.
  const onlyAspd = castEnd <= 0 && waitSource === "aspd" && skillCd <= wait;
  const castsPerSecond = reuse <= 0 ? 0 : onlyAspd ? attacksPerSecond(aspd, MAX_ASPD) : 1 / reuse;

  return {
    fixedAfterSeconds,
    fixed,
    vctAfterSeconds,
    vctAfterStats,
    vctAfterGear,
    vct,
    statMultiplier,
    statPoints,
    statPointsMissing: Math.max(VCT_STAT_CAP - statPoints, 0),
    aspdDelay,
    globalCd,
    wait,
    waitSource,
    aspdNeeded,
    aspdMissing: Math.max(aspdNeeded - aspd, 0),
    skillCdAfterSeconds,
    skillCd,
    castEnd,
    total: castEnd + wait,
    reuse,
    castsPerSecond,
  };
}
