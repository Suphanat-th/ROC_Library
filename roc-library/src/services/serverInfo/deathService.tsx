import { ServerInfoDto } from "@/types/serverInfo";

export function deathService() {
  const current = new Date();

  const deathDefault: ServerInfoDto[] = [];
  deathDefault.push({
    name: "Death Default",
    ratePercent: 100,
    DateFrom: null,
    DateTo: null,
    description: "Base death penalty rate applied to the server",
  });

  const deathAdd: ServerInfoDto[] = [];

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
