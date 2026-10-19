import type { Prize } from "@/types/scroll";

export function totalRate(prizes: Prize[]): number {
  return Math.round(prizes.reduce((sum, p) => sum + p.rate, 0) * 1000) / 1000;
}

// Weighted pick: each Prize is chosen with a chance proportional to its rate.
export function pickPrize(prizes: Prize[], random: () => number = Math.random): Prize {
  const total = prizes.reduce((sum, p) => sum + p.rate, 0);
  let cursor = random() * total;
  for (const prize of prizes) {
    cursor -= prize.rate;
    if (cursor < 0) return prize;
  }
  return prizes[prizes.length - 1];
}
