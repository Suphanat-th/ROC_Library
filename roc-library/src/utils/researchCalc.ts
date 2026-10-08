import { ResearchType } from "@/data/researchData";

export interface ResearchResult {
  totalBooks: number;
  totalMinutes: number;
  minMedals: number;
  maxMedals: number;
}

export const calcResearch = (
  types: ResearchType[],
  counts: Record<string, number>,
): ResearchResult => {
  const result: ResearchResult = {
    totalBooks: 0,
    totalMinutes: 0,
    minMedals: 0,
    maxMedals: 0,
  };

  for (const type of types) {
    const count = counts[type.key] ?? 0;
    if (count <= 0) continue;

    const medals = type.rewards.map((reward) => reward.medals);

    result.totalBooks += count;
    result.totalMinutes += count * type.minutes;
    result.minMedals += count * Math.min(...medals);
    result.maxMedals += count * Math.max(...medals);
  }

  return result;
};

// Rolls every book independently by reward weight and sums the medals.
export const simulateResearch = (
  types: ResearchType[],
  counts: Record<string, number>,
): number => {
  let total = 0;

  for (const type of types) {
    const count = counts[type.key] ?? 0;
    const totalWeight = type.rewards.reduce((sum, reward) => sum + reward.chance, 0);

    for (let book = 0; book < count; book++) {
      let roll = Math.random() * totalWeight;
      for (const reward of type.rewards) {
        roll -= reward.chance;
        if (roll < 0) {
          total += reward.medals;
          break;
        }
      }
    }
  }

  return total;
};

export const formatMinutes = (totalMinutes: number): string => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} วัน`);
  if (hours > 0) parts.push(`${hours} ชม.`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} นาที`);
  return parts.join(" ");
};
