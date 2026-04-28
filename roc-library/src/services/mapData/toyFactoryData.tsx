import { ToyFactoryMapData } from "@/types/toyFactory";

// 2x2 Grid Layout:
// Top Left (Map 3) | Top Right (Map 4)
// Bottom Left (Map 1) | Bottom Right (Map 2)

// Map 3 - Top Left
export const map3Bounds = [
  [200, 0],
  [400, 200],
];
export const toyFactoryMap3Data: ToyFactoryMapData = {
  mapName: "Toy Factory - Map 3",
  center: [100, 100],
  zoom: 0,
  warp: [
    {
      id: "warp_31",
      name: "Warp",
      type: "property",
      coordinates: [200, 280],
      description: "Warp to other maps",
    },
    {
      id: "warp_32",
      name: "Warp",
      type: "property",
      coordinates: [163, 325],
      description: "Warp to other maps",
    },
  ],
  miniBosses: [],
  treasure: [],
  bosses: [],
  paths: [
    {
      id: "guideline31",
      name: "Main Route",
      coordinates: [
        [275, 202],
        [200, 202],
        [200, 280],
      ],
      weight: 4,
      color: "blue",
    },
    {
      id: "guideline32",
      name: "Main Route",
      coordinates: [
        [200, 290],
        [200, 300],
        [210, 300],
        [210, 325],
      ],
      weight: 4,
      color: "blue",
    },
    {
      id: "guideline33",
      name: "Main Route",
      coordinates: [
        [200, 325],
        [163, 325],
      ],
      weight: 4,
      color: "blue",
    },
    {
      id: "guideline34",
      name: "Main Route",
      coordinates: [
        [155, 325],
        [100, 322],
        [100, 335],
        [115, 335],
        [115, 365],
        [290, 365],
      ],
      weight: 4,
      color: "white",
    },
    {
      id: "guideline35",
      name: "Main Route",
      coordinates: [
        [290, 370],
        [95, 370],
        [95, 317],
        [155, 320],
      ],
      weight: 4,
      color: "white",
    },
    {
      id: "guideline36",
      name: "Main Route",
      coordinates: [
        [163, 322],
        [320, 322],
        [320, 280],
        [340, 280],
      ],
      weight: 4,
      color: "white",
    },
  ],
  npcs: [],
};

// Map 4 - Top Right
export const map4Bounds = [
  [200, 200],
  [400, 400],
];
export const toyFactoryMap4Data: ToyFactoryMapData = {
  mapName: "Toy Factory - Map 4",
  center: [100, 300],
  zoom: 0,
  warp: [
    {
      id: "warp_41",
      name: "Warp",
      type: "property",
      coordinates: [240, 325],
      description: "Warp to other maps",
    },
    {
      id: "warp_42",
      name: "Warp",
      type: "property",
      coordinates: [320, 240],
      description: "Warp to other maps",
    },
  ],
  miniBosses: [
    {
      id: "mini_boss_celine_fake",
      name: "Celine Kimi (ตัวปลอม)",
      type: "monster",
      coordinates: [365, 290],
      description: "ฆ่า celine ทิ้งให้หมดทั้งตัวจริงและตัวปลอม",
      imagePath: "/assets/images/horrortoyfactory/Celine.gif",
    },
  ],
  treasure: [
    {
      id: "treasure_41",
      name: "Treasure Chest",
      type: "property",
      coordinates: [330, 220],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_42",
      name: "Treasure Chest",
      type: "property",
      coordinates: [337, 220],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_43",
      name: "Treasure Chest",
      type: "property",
      coordinates: [344, 220],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_44",
      name: "Treasure Chest",
      type: "property",
      coordinates: [351, 220],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_45",
      name: "Treasure Chest",
      type: "property",
      coordinates: [358, 220],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_46",
      name: "Treasure Chest",
      type: "property",
      coordinates: [330, 210],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_47",
      name: "Treasure Chest",
      type: "property",
      coordinates: [337, 210],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_48",
      name: "Treasure Chest",
      type: "property",
      coordinates: [344, 210],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_49",
      name: "Treasure Chest",
      type: "property",
      coordinates: [351, 210],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
    {
      id: "treasure_410",
      name: "Treasure Chest",
      type: "property",
      coordinates: [358, 210],
      description: "Treasure Chest",
      imagePath: "/assets/images/horrortoyfactory/treasure.gif",
    },
  ],
  bosses: [
    {
      id: "boss_celine_mvp",
      name: "Celine (MVP)",
      type: "monster",
      coordinates: [365, 275],
      description: "ฆ่า celine ทิ้งให้หมดทั้งตัวจริงและตัวปลอม",
      imagePath: "/assets/images/horrortoyfactory/Celine.gif",
      level: 111,
    },
  ],
  paths: [
    {
      id: "guideline41",
      name: "Main Route",
      coordinates: [
        [340, 270],
        [320, 270],
        [320, 240],
      ],
      weight: 4,
      color: "yellow",
    },
  ],
  npcs: [
    {
      id: "npc_capturedsanta1",
      name: "Captured Santa",
      coordinates: [205, 328],
      imagePath: "/assets/images/horrortoyfactory/CapturedSanta.gif",
      header: "Santa - ถูกมัด",
      text: `แก้มัดเชือกที่จับ Santa ไว้ให้สำเร็จเพื่อปลดปล่อย Santa ออกมา`,
    },
    {
      id: "npc_antonio",
      name: "Antonio",
      coordinates: [205, 332],
      imagePath: "/assets/images/horrortoyfactory/Antonio.gif",
      header: "Antonio",
      text: ``,
    },
    {
      id: "npc_antonio2",
      name: "Antonio Monster",
      coordinates: [300, 360],
      imagePath: "/assets/images/horrortoyfactory/Antonio.gif",
      header: "Antonio Monster",
      text: `ฆ่า Antonio เพื่อผ่าน 10 Hit`,
    },
    {
      id: "npc_catherine3",
      name: "Catherine",
      coordinates: [348, 283],
      imagePath: "/assets/images/horrortoyfactory/Catherine.gif",
      header: "Catherine - เปิดบอส",
      text: `เพียงแค่เดินเข้ามาใกล้ Celine ก็จะเกิด แต่จะคุยกันนานหน่อยนะ`,
    },
  ],
};

// Map 1 - Bottom Left
export const map1Bounds = [
  [0, 0],
  [200, 200],
];
export const toyFactoryMap1Data: ToyFactoryMapData = {
  mapName: "Toy Factory - Map 1",
  center: [300, 100],
  zoom: 0,
  warp: [
    {
      id: "warp_1",
      name: "Warp",
      type: "property",
      coordinates: [110, 198],
      description: "Warp ไปยัง Map 2",
    },
  ],
  miniBosses: [],
  treasure: [],
  bosses: [],
  paths: [
    {
      id: "guideline11",
      name: "Main Route",
      coordinates: [
        [170, 17],
        [20, 17],
        [20, 160],
      ],
      weight: 2,
      color: "cyan",
    },
    {
      id: "guideline12",
      name: "Main Route",
      coordinates: [
        [20, 160],
        [70, 160],
        [83, 150],
        [83, 30],
      ],
      weight: 2,
      color: "cyan",
    },
    {
      id: "guideline13",
      name: "Main Route",
      coordinates: [
        [83, 30],
        [150, 30],
      ],
      weight: 2,
      color: "cyan",
    },
    {
      id: "guideline14",
      name: "Main Route",
      coordinates: [
        [150, 30],
        [150, 160],
        [165, 160],
        [165, 180],
        [100, 180],
        [100, 198],
        [110, 198],
      ],
      weight: 2,
      color: "cyan",
    },
  ],
  npcs: [
    {
      id: "npc_catherine",
      name: "Catherine",
      coordinates: [170, 17],
      imagePath: "/assets/images/horrortoyfactory/Catherine.gif",
      header: "Catherine - NPC ตัวนี้คุยตัวแรก",
      text: `
        <ul class="space-y-2 list-none p-0">
          <li><button class="npc-option-btn w-full text-left px-3 py-2 bg-gray-500 hover:bg-blue-600 text-white rounded text-xs" >...</button></li>
          <li><button class="npc-option-btn w-full text-left px-3 py-2 bg-gray-500 hover:bg-blue-600 text-white rounded text-xs" >...</button></li>
          <li><button class="npc-option-btn w-full text-left px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs" >เลือกข้อนี้ !!!</button></li>
        </ul>
      `,
    },
    {
      id: "npc_employee0",
      name: "Employee-Box",
      coordinates: [173, 13],
      imagePath: "/assets/images/horrortoyfactory/Employee.gif",
      header: "คุยกล่องของขวัญเพื่อแปลงร่างเป็น Employee-Box",
      text: ``,
    },
    {
      id: "npc_employee1",
      name: "Employee-Box",
      coordinates: [11, 13],
      imagePath: "/assets/images/horrortoyfactory/Employee.gif",
      header: "คุยกล่องของขวัญเพื่อแปลงร่างเป็น Employee-Box",
      text: ``,
    },
    {
      id: "npc_employee2",
      name: "Employee-Box",
      coordinates: [11, 160],
      imagePath: "/assets/images/horrortoyfactory/Employee.gif",
      header: "คุยกล่องของขวัญเพื่อแปลงร่างเป็น Employee-Box",
      text: ``,
    },
    {
      id: "npc_fact1",
      name: "Fact",
      coordinates: [108, 200],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header:
        "คุย Fact ตัวก่อนหลังจากกำจัด Monster ภายในแมพหมดแล้ว จากนั้นแปลงร่างเป็น Employee-Box กับ NPC - Employee Box 2",
      text: ``,
    },
    {
      id: "npc_employee3",
      name: "Employee-Box 2",
      coordinates: [101, 200],
      imagePath: "/assets/images/horrortoyfactory/Employee.gif",
      header: "คุยกล่องของขวัญเพื่อแปลงร่างเป็น Employee-Box",
      text: ``,
    },
  ],
};

// Map 2 - Bottom Right
export const map2Bounds = [
  [0, 200],
  [200, 400],
];
export const toyFactoryMap2Data: ToyFactoryMapData = {
  mapName: "Toy Factory - Map 2",
  center: [300, 300],
  zoom: 0,
  warp: [
    {
      id: "warp_21",
      name: "Warp",
      type: "property",
      coordinates: [277, 200],
      description: "Warp to other maps",
    },
    {
      id: "warp_22",
      name: "Warp",
      type: "property",
      coordinates: [287, 160],
      description: "Warp to other maps",
    },
  ],
  miniBosses: [],
  treasure: [],
  bosses: [],
  paths: [
    {
      id: "guideline21",
      name: "Main Route",
      coordinates: [
        [120, 198],
        [280, 198],
      ],
      weight: 2,
      color: "cyan",
    },
    {
      id: "guideline22",
      name: "Main Route",
      coordinates: [
        [292, 145],
        [268, 145],
        [268, 180],
        [215, 180],
        [215, 104],
        [195, 104],
        [195, 5],
      ],
      weight: 4,
      color: "red",
    },
    {
      id: "guideline_worker",
      name: "Main Route",
      coordinates: [
        [200, 5],
        [200, 100],
        [218, 100],
        [218, 140],
        [222, 140],
        [222, 75],
        [300, 75],
        [300, 30],
        [370, 30],
        [370, 10],
        [305, 10],
        [305, 160],
        [290, 160],
      ],
      weight: 4,
      color: "green",
    },
  ],
  npcs: [
    {
      id: "npc_catherine2",
      name: "Catherine",
      coordinates: [287, 157],
      imagePath: "/assets/images/horrortoyfactory/Catherine.gif",
      header: "Catherine - NPC ตัวนี้คุยตัวแรก",
      text: `
        <ul class="space-y-2 list-none p-0">
          <li><button class="npc-option-btn w-full text-left px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs" >...</button></li>
          <li><button class="npc-option-btn w-full text-left px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs" >...</button></li>
          <li><button class="npc-option-btn w-full text-left px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs" >เลือกข้อนี้ !!!</button></li>
        </ul>
      `,
    },
    {
      id: "npc_employee2",
      name: "Employee-Box",
      coordinates: [292, 145],
      imagePath: "/assets/images/horrortoyfactory/Employee.gif",
      header: "คุยกล่องของขวัญเพื่อแปลงร่างเป็น Employee-Box",
      text: ``,
    },
    {
      id: "npc_fact21",
      name: "Worker 1",
      coordinates: [210, 38],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact22",
      name: "Worker 2",
      coordinates: [204, 69],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact23",
      name: "Worker 3",
      coordinates: [201, 102],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact24",
      name: "Worker 4",
      coordinates: [240, 145],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact25",
      name: "Worker 5",
      coordinates: [322, 73],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact26",
      name: "Worker 6",
      coordinates: [254, 70],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact27",
      name: "Worker 7",
      coordinates: [306, 30],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact28",
      name: "Worker 8",
      coordinates: [326, 8],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact29",
      name: "Worker 9",
      coordinates: [358, 33],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
    {
      id: "npc_fact210",
      name: "Worker 10",
      coordinates: [380, 10],
      imagePath: "/assets/images/horrortoyfactory/Fact.gif",
      header: "คุย Worker ให้ครบทั้ง 10 ตัว จากนั้นค่อยไปแก้มัดเชือก",
      text: ``,
    },
  ],
};

// Merged map data with all 4 maps
export const toyFactoryMergedMapData: ToyFactoryMapData = {
  mapName: "Toy Factory - All Maps",
  center: [200, 200],
  zoom: 0,
  warp: [
    ...toyFactoryMap1Data.warp,
    ...toyFactoryMap2Data.warp,
    ...toyFactoryMap3Data.warp,
    ...toyFactoryMap4Data.warp,
  ],
  miniBosses: [
    ...toyFactoryMap1Data.miniBosses,
    ...toyFactoryMap2Data.miniBosses,
    ...toyFactoryMap3Data.miniBosses,
    ...toyFactoryMap4Data.miniBosses,
  ],
  treasure: [
    ...toyFactoryMap1Data.treasure,
    ...toyFactoryMap2Data.treasure,
    ...toyFactoryMap3Data.treasure,
    ...toyFactoryMap4Data.treasure,
  ],
  bosses: [
    ...toyFactoryMap1Data.bosses,
    ...toyFactoryMap2Data.bosses,
    ...toyFactoryMap3Data.bosses,
    ...toyFactoryMap4Data.bosses,
  ],
  npcs: [
    ...(toyFactoryMap1Data.npcs || []),
    ...(toyFactoryMap2Data.npcs || []),
    ...(toyFactoryMap3Data.npcs || []),
    ...(toyFactoryMap4Data.npcs || []),
  ],
  paths: [
    ...toyFactoryMap1Data.paths,
    ...toyFactoryMap2Data.paths,
    ...toyFactoryMap3Data.paths,
    ...toyFactoryMap4Data.paths,
  ],
};

// Legacy export for backwards compatibility
export const toyFactoryMapData: ToyFactoryMapData = toyFactoryMergedMapData;
