import { ServerInfoDto } from "@/types/serverInfo";

export function dropService() {
  const dropDefault: ServerInfoDto[] = [];
  dropDefault.push({
    name: "Drop Default",
    ratePercent: 100,
    DateFrom: null,
    DateTo: null,
  }); 

  const dropAdd: ServerInfoDto[] = [];

  return [...dropDefault,...dropAdd];
}
