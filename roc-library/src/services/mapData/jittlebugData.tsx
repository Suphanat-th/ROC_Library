import type { MemorialDungeonGuide } from "@/types/memorialDungeon";

/**
 * Nightmarish Jitterbug (map 1@jtb).
 * Sources: roc.gnjoy.in.th memorial-dungeon-nightmarish-jitterbug (official ROC)
 * for the guide, ratemyserver 1@jtb for monster names/ids. Level and HP are left
 * out on purpose: ratemyserver is Renewal data and may differ from ROC.
 */
export const jittlebugGuide: MemorialDungeonGuide = {
  entry: { npc: "Loretze", location: "dali02 108 94" },
  minLevel: 100,
  minPartySize: 1,
  timeLimitMinutes: 60,
  resetTime: "04:00",
  route: [
    "เข้าดันแล้วคุยกับ Loretze อีกครั้ง",
    "มอนสเตอร์จะปรากฏ ฆ่าต่อเนื่องจนกว่าจะมีประตูวาร์ป (Warp gate) ขึ้น",
    "ฆ่ามอนสเตอร์ต่อไปจนถึง Boss 1 แล้วกำจัดให้ได้",
    "ลงต่อไปจนถึง Boss 2 กำจัดแล้วจึงเข้าโซนถัดไป",
    "เมื่อกำจัดมอนสเตอร์และบอสครบ Campanella จะปรากฏและถามว่าจะไปต่อหรือหยุด",
    "ก่อนออกจากดัน เอา Tooth of Jitterbug ไปแลกที่ Pimpernel",
  ],
  monsters: [
    { id: 3069, name: "Pere / Ferre (Earth 2)" },
    { id: 3070, name: "Pere / Ferre (Water 2)" },
    { id: 3071, name: "Pere / Ferre (Water 2)" },
    { id: 3072, name: "Pere / Ferre (Earth 2)" },
    { id: 3108, name: "Jitterbug1" },
    { id: 3109, name: "Jitterbug2" },
    { id: 3073, name: "Grand Pere / Awakened Ferre", mvp: true },
  ],
  rewards: [
    {
      title: "แลกกับ Pimpernel ด้วย Tooth of Jitterbug 50 ชิ้น (สุ่ม)",
      items: [
        "Bow of Storm [1]",
        "Gigantic Bow [1]",
        "Pendant of Harmony",
        "Pendant of Chaos",
        "Floral Bracelet Of Igu [1]",
        "Winged Ring Of Newoz [1]",
        "Frozen Breastplate [1]",
        "Hardened Breastplate [1]",
        "Old Card Album",
        "Magic Card Album",
      ],
    },
    {
      title: "ประกอบกับ Pimpernel",
      items: ["Pendant of Harmony + Pendant of Chaos → Pendant of Maelstrom [1]"],
    },
    {
      title: "การ์ดที่ดรอป",
      items: [
        "Playing Pere Card",
        "Singing Pere Card",
        "Jitterbug Card",
        "Awaken Pere Card",
      ],
    },
  ],
};
