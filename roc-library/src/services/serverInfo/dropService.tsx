import { ServerInfoDto } from "@/types/serverInfo";

export function dropService() {
  const current = new Date();

  const dropDefault: ServerInfoDto[] = [];
  dropDefault.push({
    name: "100%",
    ratePercent: 100,
    DateFrom: null,
    DateTo: null,
    description: "Base drop rate applied to the server",
  }); 

  const dropAdd: ServerInfoDto[] = [];


  
  dropAdd.push({
    name: "Sun Moon 50%",
    ratePercent: 50,
    DateFrom: new Date(2026, 4, 6, 6, 0, 0),
    DateTo: new Date(2026, 4, 27, 6, 0, 0),
    description: "Sun Moon Event เพิ่ม Drop 50%",
  });


  return [
    ...dropDefault.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      return isStarted && isNotEnded;
    }),
    ...dropAdd.filter((f) => {
      const isStarted = f.DateFrom === null || f.DateFrom <= current;
      console.log("isStarted", isStarted);
      const isNotEnded = f.DateTo === null || f.DateTo >= current;
      console.log("isStarted", isNotEnded);
      return isStarted && isNotEnded;
    }),
  ];
}
