export type Tier = "SSR" | "SR" | "A" | "B" | "C" | "E";

export interface Prize {
  id: string;
  name: string;
  image: string;
  quantity: number;
  tier: Tier;
  /** Drop rate in percent. Every Prize of a Scroll adds up to 100. */
  rate: number;
}

export interface RollHistoryEntry {
  key: string;
  roll: number;
  prize: Prize;
  at: Date;
}
