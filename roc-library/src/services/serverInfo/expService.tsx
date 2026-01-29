import { ServerInfoDto } from "@/types/serverInfo";

export function expService() {
  const current = new Date();

  const expDefault: ServerInfoDto[] = [];
  expDefault.push({
    name: "Exp Default",
    ratePercent: 100,
    DateFrom: null,
    DateTo: null,
  });

  const expAdd: ServerInfoDto[] = [];


  return [
    ...expDefault.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      return isStarted && isNotEnded;
    }),
    ...expAdd.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      return isStarted && isNotEnded;
    }),
  ];
}
