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

  expAdd.push({
    name: "จากกิจกรรม x Event สุดพิเศษจากเกม Ragnarok Endless Trails",
    ratePercent: 100,
    DateFrom: new Date(2026, 1, 27, 0, 0, 0),
    DateTo: new Date(2026, 2, 6, 0, 0, 0),
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
