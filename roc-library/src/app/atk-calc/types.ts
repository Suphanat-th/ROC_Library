export type AttackRange = "melee" | "ranged";

export interface AtkInput {
  range: AttackRange;
  baseLevel: number;
  strBase: number;
  strBonus: number;
  dexBase: number;
  dexBonus: number;
  lukBase: number;
  lukBonus: number;
  weaponAtk: number;
  weaponLevel: number;
  refine: number;
  /** Critical / Power Maximize: Variance always rolls its maximum */
  maxVariance: boolean;
  equipAtk: number;
  masteryAtk: number;
  /** Level 1 multiplier */
  atkPct: number;
  /** Level 2 multipliers (race, element, size, monster type) */
  racePct: number;
  sizePct: number;
  elementPct: number;
  typePct: number;
  /** Level 3 multipliers */
  rangePct: number;
  critPct: number;
  skillPct: number;
  def: number;
}

export interface AtkResult {
  statusAtk: number;
  bonusStat: number;
  weaponMin: number;
  weaponMax: number;
  refineBonus: number;
  overrefineMin: number;
  overrefineMax: number;
  level2: number;
  aMin: number;
  aMax: number;
  bMin: number;
  bMax: number;
  level3: number;
  finalMin: number;
  finalMax: number;
  min: number;
  max: number;
  avg: number;
}
