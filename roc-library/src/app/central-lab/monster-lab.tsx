"use client";
import React from "react";
import Image from "next/image";
import { ElementBadges } from "./monster-lab-element";
import { Monster } from "@/types/monster";

const monsters: Monster[] = [
  {
    name: "Orc Hero",
    image: "/assets/images/Cenlab/R1_OrcHero.gif",
    lv: 50,
    hp: 362000,
    race: "Demi-Human",
    property: "Earth 2",
    scale: "Large",
    def: 197,
    mdef: 70,
    hit: 340,
    element: {
      neutral: 100,
      water: 100,
      earth: 0,
      fire: 175,
      wind: 80,
      poison: 150,
      holy: 100,
      shadow: 100,
      ghost: 100,
      undead: 100,
    },
  },
  {
    name: "Orc Lord",
    image: "/assets/images/Cenlab/R1_OrcLord.gif",
    lv: 55,
    hp: 552000,
    race: "Demi-Human",
    property: "Earth 4",
    scale: "Large",
    def: 256,
    mdef: 92,
    hit: 367,
    element: {
      neutral: 100,
      water: 100,
      earth: 0,
      fire: 200,
      wind: 60,
      poison: 125,
      holy: 100,
      shadow: 100,
      ghost: 100,
      undead: 100,
    },
  },
  {
    name: "Eddga",
    image: "/assets/images/Cenlab/R1_Eddga.gif",
    lv: 65,
    hp: 947500,
    race: "Brute",
    property: "Fire 1",
    scale: "Large",
    def: 166,
    mdef: 70,
    hit: 362,
    element: {
      neutral: 100,
      water: 150,
      earth: 90,
      fire: 25,
      wind: 100,
      poison: 150,
      holy: 100,
      shadow: 100,
      ghost: 100,
      undead: 90,
    },
  },
  {
    name: "Golden Thief Bug",
    image: "/assets/images/Cenlab/R1_GoldenThiefBug.gif",
    lv: 65,
    hp: 222750,
    race: "Insect",
    property: "Fire 2",
    scale: "Large",
    def: 159,
    mdef: 81,
    hit: 357,
    element: {
      neutral: 100,
      water: 175,
      earth: 80,
      fire: 0,
      wind: 100,
      poison: 150,
      holy: 100,
      shadow: 100,
      ghost: 100,
      undead: 80,
    },
  },
  {
    name: "Osiris",
    image: "/assets/images/Cenlab/R1_Osiris.gif",
    lv: 68,
    hp: 1175840,
    race: "Undead",
    property: "Undead 4",
    scale: "Medium",
    def: 172,
    mdef: 164,
    hit: 380,
    element: {
      neutral: 100,
      water: 100,
      earth: 100,
      fire: 200,
      wind: 100,
      poison: 0,
      holy: 200,
      shadow: 0,
      ghost: 175,
      undead: 0,
    },
  },
];

export default function MonsterTablePage() {
  return (
    <main className="min-h-screen text-gray-100 p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Round 1</h1>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 w-max">
          {monsters.map((m) => (
            <div
              key={m.name}
              className="bg-gray-600 rounded-2xl p-4 w-[500px] shrink-0 shadow-lg shadow-gray-700 border border-gray-700 hover:border-cyan-400 transition grid grid-cols-2"
            >
              <div className="flex flex-col items-center col-span-1">
                <h2 className="text-2xl font-semibold text-cyan-300">
                  {m.name}
                </h2>
                <Image
                  src={m.image}
                  alt={m.name}
                  width={96}
                  height={96}
                  className="object-contain mb-3"
                />
                <div className="text-xl mt-3 space-y-1">
                  <p>
                    <span className="text-gray-400">LV:</span> {m.lv}
                  </p>
                  <p>
                    <span className="text-gray-400">HP:</span>{" "}
                    {m.hp ? Number(m.hp).toLocaleString() : 0}
                  </p>
                  <p>
                    <span className="text-gray-400">เผ่าพันธุ๋:</span> {m.race}
                  </p>
                  <p>
                    <span className="text-gray-400">ธาตุ:</span> {m.property}
                  </p>
                  <p>
                    <span className="text-gray-400">ขนาด:</span> {m.scale}
                  </p>
                  <p>
                    <span className="text-gray-400">Def:</span> {m.def}
                  </p>
                  <p>
                    <span className="text-gray-400">Mdef:</span> {m.mdef}
                  </p>
                </div>
              </div>

              <div className=" col-span-1">
                <p>
                  <span className="text-gray-400">
                    ความเสียหายของมอนสเตอร์:
                  </span>{" "}
                  <main className="p-8">
                    <ElementBadges element={m.element} />
                  </main>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
