export type Tier = "SSR" | "SR" | "R" | "A" | "B" | "C" | "E";

/** One Scroll the player can pick on the Random Scroll page. */
export interface ScrollDef {
  /** Used in the page address (?scroll=<id>), so keep it short and lowercase. */
  id: string;
  title: string;
  /** Picture shown on the Scroll's card in the picker. */
  cover: string;
  /** Where the Prize list and rates were copied from. */
  source?: string;
  prizes: Prize[];
}

export interface Prize {
  id: string;
  name: string;
  image: string;
  quantity: number;
  tier: Tier;
  /** Drop rate in percent, as the game publishes it. A draw is weighted by these even when they do not total 100. */
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
