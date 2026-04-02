import { ServerInfoDto } from "@/types/serverInfo";

export function deathService() {
  const current = new Date();

  const deathDefault: ServerInfoDto[] = [];
  deathDefault.push({
    name: "100%",
    ratePercent: 100,
    DateFrom: null,
    DateTo: null,
    description: "Base death penalty rate applied to the server",
  });

  const deathAdd: ServerInfoDto[] = [];

  deathAdd.push({
    name: "-100%",
    ratePercent: -100,
    DateFrom: new Date(2026, 3, 1, 15, 0, 0),
    DateTo: new Date(2026, 3, 8, 6, 0, 0),
    description: "Moon Event ลด Death Penalty 100%",
  });
  return [
    ...deathDefault.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      return isStarted && isNotEnded;
    }),
    ...deathAdd.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      return isStarted && isNotEnded;
    }),
  ];
}
