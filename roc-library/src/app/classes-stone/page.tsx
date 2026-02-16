"use client";

import { useMemo, useState } from "react";
import JobStoneCard from "./stoneClasses";
import { JobSelect } from "./jobFilter";
import { JobClass, StoneClasses } from "@/types/StoneClassses";

export default function JobStonesPage() {
  const comboTag =
    "<div class='font-semibold mb-1 text-error'>[ Combo Effect ]</div>";
  const hrTag = "<hr class='my-2'>";
  const fieldset =
    "<fieldset class='fieldset  bg-base-200 [BORDER] rounded-box  border p-4 my-3' <legend class='fieldset-legend'>[TEXT]</legend> <p class='label underline font-bold'>[DESC]</p></fieldset>";
  const headerGarmentCombo =
    "<div class='flex w-full justify-center'>[TEXT]<span class='badge badge-[COLOR] badge-xs ml-2'>[POSITION]</span></div>";
  const jobStones: JobClass[] = [
    {
      name: "Lord Knight",
      class: "LordKnight",
      image: "/assets/images/ClassesJob/LordKnight.webp",
      Stone: [
        {
          name: "Lord Knight Stone I",
          version: 1,
          image: "/assets/images/ClassesJob/LordKnight.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Lord Knight Stone",
              version: 0,
              image: "/assets/images/Icon/DefualtIconStone.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่มดาเมจ Bowling Bash </span><img src='https://irowiki.org/w/images/5/53/Bowling_Bash.png?20070923200800' class='h-6 w-6 mx-3'/> และ Brandish Spear <img src='https://irowiki.org/w/images/2/20/Brandish_Spear.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 10%</span>",
                ],
                upper: [
                  "<span>เพิ่มดาเมจ Clashing Spiral</span> <img src='https://irowiki.org/w/images/0/0f/Clashing_Spiral.png' class='h-6 w-6 mx-3'/> <span> ขึ้น 10%</span>",
                ],
                middle: [
                  "มีโอกาส 1% ที่จะได้รับ HP,SP กลับมา 10% ของความเสียหายกายภาพ",
                ],
                lower: ["ลด Fix Cast time 40%"],
              },
            },
            {
              name: "Lord Knight Stone",
              version: 1,
              image: "/assets/images/Icon/DefualtIconStone.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุกๆ การเรียนรู้สกิล </span><img src='https://irowiki.org/w/images/5/52/Spear_Mastery.png' class='h-6 w-6 mx-3'/>  <span>Spear Mastery 1 เลเวล ATK +2</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Lord Knight Stone",
              version: 2,
              image: "/assets/images/Icon/DefualtIconStone.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>เพิ่มดาเมจ Clashing Spiral</span> <img src='https://irowiki.org/w/images/0/0f/Clashing_Spiral.png' class='h-6 w-6 mx-3'/><span> ขึ้น 15%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Lord Knight Stone",
              version: 3,
              image: "/assets/images/Icon/DefualtIconStone.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>ทุกๆ การเรียนรู้สกิล </span><img src='https://irowiki.org/w/images/9/9f/Cavalier_Mastery.png' class='h-6 w-6 mx-3'/> <span>Cavalier Mastery เพิ่ม 1 เลเวล เพิ่ม ASPD 1%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
        // {
        //   name: "Lord Knight Stone II",
        //   version: 2,
        //   image: "/assets/images/ClassesJob/LordKnight.webp",
        //   description: [""],
        //   stone: [
        //     {
        //       name: "Lord Knight Stone II",
        //       version: 0,
        //       image: "assets/images/Icon/LordKnightStoneGarment2.png",
        //       stone: [],
        //       description: [
        //         "<div class='flex justify-center'>เพิ่มดาเมจ Bowling Bash <img src='https://irowiki.org/w/images/5/53/Bowling_Bash.png?20070923200800' class='h-6 w-6 mx-3'/> 20%</div>",
        //         hrTag,
        //         "เมื่อใช้กับ Lord Knight Stone II (Upper) เพิ่ม Damage สกิล Bowling Bash 10%",
        //         "เมื่อใช้กับ Lord Knight Stone II (Middle) ทุก ๆ การเรียนรู้สกิล Parrying 2 เลเวล ลดระยะเวลาร่ายแบบคงที่ 0.1 วินาที",
        //         "เมื่อใช้กับ Lord Knight Stone II (Lower) เพิ่ม Damage ทางกายภาพระยะใกล้ 5%",
        //       ],
        //     },
        //     {
        //       name: "Lord Knight Stone II",
        //       version: 1,
        //       image: "assets/images/Icon/LordKnightStone2.png",
        //       stone: [],
        //       description: [
        //         "ทุก ๆ การเรียนรู้สกิล Concentration 1 เลเวล เพิ่ม DEF +10",
        //         hrTag,
        //         comboTag,
        //         "<div class='flex justify-center'>เพิ่มดาเมจ Bowling Bash <img src='https://irowiki.org/w/images/5/53/Bowling_Bash.png?20070923200800' class='h-6 w-6 mx-3'/> 10%</div>",
        //       ],
        //     },
        //     {
        //       name: "Lord Knight Stone II",
        //       version: 2,
        //       image: "assets/images/Icon/LordKnightStone2.png",
        //       stone: [],
        //       description: [
        //         "<div class='flex justify-center'>เพิ่มดาเมจ Bowling Bash <img src='https://irowiki.org/w/images/5/53/Bowling_Bash.png?20070923200800' class='h-6 w-6 mx-3'/> 20%</div>",
        //         hrTag,
        //         comboTag,
        //         "ทุก ๆ การเรียนรู้สกิล Parrying 2 เลเวล ลดระยะเวลาร่ายแบบคงที่ 0.1 วินาที",
        //       ],
        //     },
        //     {
        //       name: "Lord Knight Stone II",
        //       version: 3,
        //       image: "assets/images/Icon/LordKnightStone2.png",
        //       stone: [],
        //       description: [
        //         "ทุกๆ การเรียนรู้สกิล Aura Blade เพิ่ม 1 เลเวล เพิ่ม ATK+5 , HIT+1",
        //         hrTag,
        //         comboTag,
        //         "เพิ่ม Damage ทางกายภาพระยะใกล้ 5%",
        //       ],
        //     },
        //   ],
        // },
      ],
    },
    {
      name: "Ninja",
      class: "Ninja",
      image: "/assets/images/ClassesJob/LordKnight.webp",
      Stone: [
        {
          name: "Oboro Stone",
          version: 1,
          image: "/assets/images/ClassesJob/Oboro.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Oboro Stone",
              version: 0,
              image: "/assets/images/Icon/OboroStoneGarment.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่ม Damage สกิล </span><img src='https://irowiki.org/w/images/3/3e/Flaming_Petals.png' class='h-6 w-6 mx-3'/><span> Flaming Petals 20%</span>",
                ],
                upper: [
                  "<span>เพิ่ม Damage สกิล </span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/3/3f/Exploding_Dragon.png' class='h-6 w-6 mx-3'/><span> [Exploding Dragon] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/3/3f/Snow_Flake_Draft.png' class='h-6 w-6 mx-3'/> <span> [Snow Flake Draft] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/1/1c/First_Wind.png' class='h-6 w-6 mx-3'/>  <span> [First Wind] </span></span>",
                  "<span>เพิ่มขึ้น 30%</span>",
                ],
                middle: [
                  "<span>เพิ่ม Damage สกิล </span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/d/d0/Freezing_Spear.png' class='h-6 w-6 mx-3'/><span> [Freezing Spear] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/c/c4/Wind_Blade.png' class='h-6 w-6 mx-3'/> <span> [Wind Blade] , </span></span>",
                  "<span>เพิ่มขึ้น 20%</span>",
                ],
                lower: ["ลดระยะเวลาร่ายแบบแปรผัน 15%"],
              },
            },
            {
              name: "Ninja Stone",
              version: 1,
              image: "/assets/images/Icon/OboroStoneGarment.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<div class='flex justify-center'>ทุก ๆ การเรียนรู้สกิล <img src='https://irowiki.org/w/images/b/b2/Ninja_Mastery.png' class='h-6 w-6 mx-3'/>  Ninja Mastery 1 เลเวล ATK +2, MATK +2 </div>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Ninja Stone",
              version: 2,
              image: "/assets/images/Icon/OboroStoneGarment.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<div class='flex justify-center'>เพิ่ม Damage สกิล <img src='https://irowiki.org/w/images/d/d8/Throw_Huuma_Shuriken.png' class='h-6 w-6 mx-3'/>  Throw Huuma Shuriken 20%</div>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Ninja Stone",
              version: 3,
              image: "/assets/images/Icon/OboroStoneGarment.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>เพิ่ม Damage สกิล </span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/3/3f/Exploding_Dragon.png' class='h-6 w-6 mx-3'/><span> [Exploding Dragon] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/3/3f/Snow_Flake_Draft.png' class='h-6 w-6 mx-3'/> <span> [Snow Flake Draft] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/1/1c/First_Wind.png' class='h-6 w-6 mx-3'/>  <span> [First Wind] </span></span>",
                  "<span>เพิ่มขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
      ],
    },
  ];

  //   [
  //     {
  //       name: "Lord Knight Stone",
  //       job: "Lord Knight",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Swordman",
  //       image: "/assets/images/ClassesJob/LordKnight.webp",
  //     },
  //     {
  //       name: "Paladin Stone",
  //       job: "Paladin",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Mage",
  //       image: "/assets/images/ClassesJob/Paladin.webp",
  //     },
  //     {
  //       id: 3,
  //       name: "High Wizard Stone",
  //       job: "High Wizard",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/HighWizard.webp",
  //     },
  //     {
  //       name: "Professor Stone",
  //       job: "Professor",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/Professor.webp",
  //     },
  //     {
  //       name: "Mastersmith Stone",
  //       job: "Mastersmith",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Biochemist Stone",
  //       job: "Biochemist",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "High Priest Stone",
  //       job: "High Priest",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Champion Stone",
  //       job: "Champion",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Assassin Cross Stone",
  //       job: "Assassin Cross",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Stalker Stone",
  //       job: "Stalker",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Sniper Stone",
  //       job: "Sniper",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/Sniper.webp",
  //     },
  //     {
  //       name: "Clown Stone",
  //       job: "Clown",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/Clown.webp",
  //     },
  //     {
  //       name: "Gypsy Stone",
  //       job: "Gypsy",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/Gypsy.webp",
  //     },
  //   ];
  const jobOptions = [
    {
      value: "all",
      label: "All",
      image: "/assets/images/Icon/stoneIcon.png", // ใส่ไอคอนรวม หรือ placeholder
    },
    ...jobStones.flatMap((f) =>
      f.Stone.map((s) => ({
        value: s.name,
        label: s.name,
        image: s.image,
      })),
    ),
  ];

  const [filterClasses, setFilterClasses] = useState("all");

  const filteredClasses = useMemo(() => {
    if (filterClasses === "all") {
      // ดึง Stone ทุกก้อน ทุกอาชีพ
      return jobStones
        .flatMap((job) => job.Stone)
        .sort((a, b) => a.version - b.version);
    }

    // filter ตามชื่อ Stone
    return jobStones
      .flatMap((job) =>
        job.Stone.filter((stone) => stone.name === filterClasses),
      )
      .sort((a, b) => a.version - b.version);
  }, [filterClasses, jobStones]);
  console.log(filterClasses);
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🪨 หินอาชีพ (Job Stones)
      </h1>

      <div className="flex justify-center mb-6">
        <JobSelect
          options={jobOptions}
          value={filterClasses}
          onChange={setFilterClasses}
        />
      </div>

      <div className="grid grid-cols-1  gap-4">
        {filteredClasses.map((stone) => (
          <JobStoneCard key={stone.name} {...stone} />
        ))}
      </div>
    </main>
  );
}
