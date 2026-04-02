import { ServerInfoDto } from "@/types/serverInfo";

export function dropService() {
  const dropDefault: ServerInfoDto[] = [];
  dropDefault.push({
    name: "Drop Default",
    ratePercent: 100,
    DateFrom: null,
    DateTo: null,
    description: "Base drop rate applied to the server",
  }); 

  const dropAdd: ServerInfoDto[] = [];

  dropAdd.push({
    name: "จากกิจกรรม x Event สุดพิเศษจากเกม Ragnarok Endless Trails",
    ratePercent: 15,
    DateFrom: new Date(2026, 1, 27, 0, 0, 0),
    DateTo: new Date(2026, 2, 6, 0, 0, 0),
    description: "กิจกรรมพิเศษ: เพิ่มอัตรา DROP ตามช่วงกิจกรรม",
  });
  return [...dropDefault,...dropAdd];
}
