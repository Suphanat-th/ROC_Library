export interface JobEntry {
  label: string;
  icon: string;
  baseASPD: number;
  shieldPenalty: number;
  weapons: number[];
  weaponFactors: Record<number, number>;
}

export interface WeaponEntry {
  label: string;
  canOffHand: boolean;
}

export type ClassTier = "class12" | "extended" | "awakened";

export interface ClassTierEntry {
  label: string;
  icon: string;
  maxASPD: number;
  available: boolean;
}

export interface PotionOption {
  label: string;
  mod: number;
  assassinOnly: boolean;
}

export type OffHandSelection = "none" | "shield" | `w:${number}`;

export interface AspdCalculationResult {
  jobWeaponBase: number;
  aspdPenalty: number;
  aspdCorrection: number;
  statTerm: number;
  baseCase: number;
  bonusTotal: number;
  baseASPD: number;
  equipContrib: number;
  afterEquipASPD: number;
  finalRaw: number;
  final: number;
}

export interface ResultPanelProps {
  classTier: ClassTier;
  maxASPD: number;
  result: AspdCalculationResult;
  jobBaseASPD: number;
  weaponFactor: number;
  offHandFactor: number;
  flatASPD: number;
}

export interface ReverseCalcPanelProps {
  currentASPD: number;
  maxASPD: number;
  targetASPD: number;
  agi: number;
  dex: number;
  reverseCalc: ReverseCalcResult;
  onTargetChange: (value: number) => void;
}

export interface FormulaBreakdownPanelProps {
  showFormula: boolean;
  onToggle: () => void;
  result: AspdCalculationResult;
  jobBaseASPD: number;
  weaponFactor: number;
  offHandFactor: number;
  agi: number;
  dex: number;
  potionMod: number;
  skillPct: number;
  specialPct: number;
  equipPct: number;
  flatASPD: number;
  maxASPD: number;
}

export interface ReverseCalcResult {
  agiNeeded: number | null;
  dexNeeded: number | null;
}