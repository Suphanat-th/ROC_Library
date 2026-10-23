import type { ChapterQuest, RecurringQuestGroup } from "@/types/anniversary";

/**
 * Quests of the 5th Anniversary event, from the game's quest text. Obvious typos
 * of the source are fixed and the unclear line "ณ เมื่อการค้า Alberta" is left out.
 */
export const CHAPTER_QUESTS: ChapterQuest[] = [
  {
    town: "Izlude",
    gameTitle: "Chapter I - Reincarnation : การจุติใหม่",
    kind: "สังหาร",
    intro: "ท่าน Valkyrie ให้ไปสังหารมอนสเตอร์ต่อไปนี้ แล้วกลืนกินพลังมา",
    tasks: [
      { kind: "kill", label: "Plankton", count: 10, unit: "ตัว", monsterId: 1161 },
      { kind: "kill", label: "Hydra", count: 20, unit: "ตัว", monsterId: 1068 },
      { kind: "kill", label: "Marina", count: 30, unit: "ตัว", monsterId: 1141 },
    ],
    outro: "หลังจากนั้นกลับมารายงานเมื่อภารกิจสำเร็จแล้ว",
  },
  {
    town: "Payon",
    gameTitle: "Chapter II - Foundation : จุดเริ่มต้นของประเทศ",
    kind: "รวบรวม",
    tasks: [
      { kind: "collect", label: "Firewood", count: 30, unit: "ชิ้น", via: "จากการสังหาร Savage [Event]", monsterId: 1166, itemImageId: 25254 },
      { kind: "collect", label: "Leaf Made Wood", count: 30, unit: "ชิ้น", via: "จากการสังหาร Muka [Event]", monsterId: 1055, itemImageId: 6553 },
      { kind: "collect", label: "Clean Water", count: 30, unit: "ชิ้น", via: "จากการสังหาร Marina [Event]", monsterId: 1141, itemImageId: 6466 },
    ],
    outro: "หลังจากนั้นกลับมารายงานเมื่อภารกิจสำเร็จแล้ว",
  },
  {
    town: "Alberta",
    gameTitle: "Chapter III - Free trade : การเปิดเส้นทางการค้า",
    kind: "ตอบคำถาม",
    intro: "เมื่อท่านต้องการการสนับสนุน ท่านก็ต้องผ่านบททดสอบ",
    tasks: [{ kind: "quiz", label: "ตอบคำถามให้ถูกทั้งหมด", count: 5, unit: "ข้อ" }],
    notes: [
      "หากตอบผิดแม้แต่ข้อเดียว ต้องกลับมาตอบใหม่ภายหลัง",
      "เมื่อตอบผิด (กับ Black Market) ต้องรอ 30 วินาทีก่อนตอบใหม่",
    ],
  },
  {
    town: "Geffen",
    gameTitle: "Chapter IV - Trial of strength : การประลองสู่ความแข็งแกร่ง",
    kind: "สังหาร",
    intro: "ท่านได้เข้าร่วมทดสอบความแข็งแกร่ง",
    tasks: [{ kind: "kill", label: "กำจัดเป้าหมายที่กำหนดในสนามประลอง" }],
    outro: "เมื่อสำเร็จก็กลับมายืนยันกับ Stranger",
  },
  {
    town: "Morroc",
    gameTitle: "Chapter V - Break your limits : การทลายขีดจำกัด",
    kind: "รวบรวม",
    intro: "เพื่อให้ได้แหวนเวทย์มนต์",
    tasks: [
      { kind: "collect", label: "Shadow Stone", count: 45, unit: "ชิ้น", via: "จากการสังหาร Desert Wolf [Event]", monsterId: 1107, itemImageId: 105675 },
      { kind: "collect", label: "Flame Stone", count: 45, unit: "ชิ้น", via: "จากการสังหาร Jakk [Event]", monsterId: 1130, itemImageId: 105676 },
    ],
  },
  {
    town: "Prontera",
    gameTitle: "Chapter VI - The end of the beginning : จุดสิ้นสุดของจุดเริ่มต้น",
    kind: "ตามหากล่อง",
    intro: "เพื่อก้าวข้ามขีดจำกัดที่แท้จริง",
    tasks: [{ kind: "find", label: "ตามหากล่องภายในแมพให้ครบ", count: 6, unit: "จุด" }],
    coordinates: [
      "prt_q 87 339",
      "prt_q 32 157",
      "prt_q 36 76",
      "prt_q 198 157",
      "prt_q 284 271",
      "prt_q 238 40",
    ],
  },
];

export const RECURRING_QUESTS: RecurringQuestGroup[] = [
  {
    id: "daily",
    title: "Daily Quest",
    note: "เมื่อรายงานสำเร็จแล้ว ต้องรอ 1 วัน",
    quests: [
      {
        title: "Daily 1",
        tasks: [{ kind: "collect", label: "Firewood", count: 25, unit: "ชิ้น", via: "จากการสังหาร Savage [Event]", monsterId: 1166, itemImageId:25254 }],
      },
      {
        title: "Daily 2",
        tasks: [{ kind: "collect", label: "Leaf Made Wood", count: 25, unit: "ชิ้น", via: "จากการสังหาร Muka [Event]", monsterId: 1055, itemImageId: 6553 }],
      },
      {
        title: "Daily 3",
        tasks: [{ kind: "collect", label: "Clean Water", count: 25, unit: "ชิ้น", via: "จากการสังหาร Marina [Event]", monsterId: 1141, itemImageId: 6466}],
      },
    ],
  },
  {
    id: "weekly",
    title: "Weekly Quest",
    quests: [
      {
        title: "Weekly 1",
        tasks: [{ kind: "collect", label: "Shadow Stone", count: 40, unit: "ชิ้น", via: "จากการสังหาร Desert Wolf [Event]", monsterId: 1107, itemImageId: 105675}],
      },
      {
        title: "Weekly 2",
        tasks: [{ kind: "collect", label: "Flame Stone", count: 40, unit: "ชิ้น", via: "จากการสังหาร Jakk [Event]", monsterId: 1130, itemImageId: 105676 }],
      },
      {
        title: "Weekly 3",
        tasks: [{ kind: "kill", label: "สังหารมอนสเตอร์ใน Geffen Magic Tournament ตามที่กำหนด" }],
      },
    ],
  },
  {
    id: "world",
    title: "World Quest",
    note: "กิจกรรมทั้งเซิร์ฟเวอร์ · 28 ต.ค. 2026 – 13 ม.ค. 2027 · ต้องผ่าน Chapter V - Break your limits (Morroc) ก่อนรับภารกิจ",
    quests: [
      {
        title: "Dragon Cataclysm",
        tasks: [
          { kind: "find", label: "รับภารกิจจาก NPC Dragon Seal Stone", via: "Invaded Prontera · prt_q 156 188" },
          { kind: "kill", label: "Hydrolancer [Event]", via: "ปรากฏทุกวันศุกร์ เสาร์ และอาทิตย์", monsterId: 1720 },
        ],
        notes: [
          "รับได้สูงสุด 1 ภารกิจต่อ 4 วัน (รีเซ็ต 04:00)",
        ],
      },
      {
        title: "World Event",
        tasks: [
          {
            kind: "collect",
            label: "ส่ง Hydrolancer [Event] ที่ได้จาก Dragon Cataclysm",
            via: "ที่ Dragon Seal Stone · prt_q 156 188 · ส่ง 1 ครั้งนับเป็น 1",
            monsterId: 1720,
          },
        ],
        notes: [
          "ความคืบหน้าเป็นของทั้งเซิร์ฟเวอร์ ไม่ใช่รายบุคคล",
          "เมื่อยอดรวมถึงเป้าหมาย ผู้เล่นทุกคนในเซิร์ฟเวอร์ได้รับรางวัลพิเศษ",
          "เป้าหมายและรางวัลอยู่ในภาพประกาศ ยังไม่มีข้อมูล",
        ],
      },
    ],
  },
];
