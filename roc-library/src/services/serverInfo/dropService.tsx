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
    name: "75%",
    ratePercent: 75,
    DateFrom: new Date(2026, 3, 1, 15, 0, 0),
    DateTo: new Date(2026, 3, 15, 6, 0, 0),
    description: "Moon Event เพิ่ม Drop 75%",
  });


  

  dropAdd.push({
    name: "75%",
    ratePercent: 75,
    DateFrom: new Date(2026, 3, 16, 6, 0, 0),
    DateTo: new Date(2026, 3, 22, 6, 0, 0),
    description: "Moon Event เพิ่ม Drop 75%",
  });

  
  dropAdd.push({
    name: "50",
    ratePercent: 50,
    DateFrom: new Date(2026, 3, 22, 6, 0, 0),
    DateTo: new Date(2026, 3, 29, 6, 0, 0),
    description: "Moon Event เพิ่ม Drop 50%",
  });

  
  dropAdd.push({
    name: "25",
    ratePercent: 25,
    DateFrom: new Date(2026, 3, 29, 6, 0, 0),
    DateTo: new Date(2026, 4, 6, 6, 0, 0),
    description: "Moon Event เพิ่ม Drop 25%",
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
