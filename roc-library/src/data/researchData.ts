export const RESEARCH_MEDAL_NAME = "Mysterious Medal";

export interface ResearchReward {
  medals: number;
  chance: number; // relative weight, used only for the average
}

export interface ResearchType {
  key: string;
  name: string;
  minutes: number; // time per attempt
  img: string;
  rewards: ResearchReward[];
}

export const RESEARCH_TYPES: ResearchType[] = [
  {
    key: "basic",
    name: "Basic Diagnose",
    minutes: 10,
    img: "/assets/images/bp/basic_re.png",
    rewards: [
      { medals: 5, chance: 40 },
      { medals: 10, chance: 30 },
      { medals: 15, chance: 20 },
      { medals: 20, chance: 10 },
    ],
  },
  {
    key: "advanced",
    name: "Advanced Thesis",
    minutes: 5,
    img: "/assets/images/bp/advance_re.png",
    rewards: [
      { medals: 10, chance: 40 },
      { medals: 20, chance: 30 },
      { medals: 30, chance: 20 },
      { medals: 40, chance: 10 },
    ],
  },
];
