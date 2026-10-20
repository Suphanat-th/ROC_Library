export type Tier = "SSR" | "SR" | "A" | "B" | "C" | "E";

export interface Prize {
  id: string;
  name: string;
  image: string;
  quantity: number;
  tier: Tier;
  /** Drop rate in percent. Every Prize of a Scroll adds up to 100. */
  rate: number;
  /** When true, drawing this Prize shows a congratulation Announcement. */
  announce?: boolean;
}

export interface RollHistoryEntry {
  key: string;
  /** Which press of the draw button (1, 2, ...). */
  roll: number;
  /** Running Row number since the page opened, counted from 1 across every Roll. */
  row: number;
  prize: Prize;
  at: Date;
}

export interface PrizeAnnouncement {
  key: string;
  roll: number;
  row: number;
  prize: Prize;
}
