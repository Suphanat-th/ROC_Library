import { ServerInfoDto } from "@/types/serverInfo";

export function dropService() {
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
  return [...dropDefault,...dropAdd];
}
