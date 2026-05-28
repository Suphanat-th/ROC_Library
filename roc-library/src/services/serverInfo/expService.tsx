import { ServerInfoDto } from "@/types/serverInfo";

export function expService() {
  const current = new Date();

  const expDefault: ServerInfoDto[] = [];
  expDefault.push({
    name: "100%",
    ratePercent: 100,
    DateFrom: null,
    DateTo: null,
    description: "Base Server Exp 100%",
  });

  const expAdd: ServerInfoDto[] = [];

  expAdd.push({
    name: "Exp Up 100%",
    ratePercent: 100,
    DateFrom: new Date(2026, 4, 29, 12, 0, 0),
    DateTo: new Date(2026, 5, 4, 6, 0, 0),
    description: "Exp Up หยุดยาวนี้พรี่มีคูณ 100%",
  });

  return [
    ...expDefault.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      return isStarted && isNotEnded;
    }),
    ...expAdd.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      console.log("isStarted", isStarted);
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      console.log("isStarted", isNotEnded);
      return isStarted && isNotEnded;
    }),
  ];
}
