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
    name: "175%",
    ratePercent: 175,
    DateFrom: new Date(2026, 3, 1, 15, 0, 0),
    DateTo: new Date(2026, 3, 8, 6, 0, 0),
    description:
      "Moon Event เพิ่ม Exp 175%",
  });
  return [
    ...expDefault.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      return isStarted && isNotEnded;
    }),
    ...expAdd.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      console.log('isStarted',isStarted);
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      console.log('isStarted',isNotEnded);
      return isStarted && isNotEnded;
    }),
  ];
}
