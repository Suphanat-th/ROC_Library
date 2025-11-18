"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ElementBadges } from "./monster-lab-element";
import { Monster } from "@/types/monster";
import MonstersDb from "@/services/mosters/mostersDb";

const monsters: Monster[] = MonstersDb();
export default function MonsterTablePage() {
  const [searchMiniBoss, setSearchMiniBoss] = useState("");
  const [searchS1, setSearchS1] = useState("");
  const monsterStage1Id = [
    1038, 1039, 1046, 1086, 1087, 1115, 1147, 1150, 1159, 1190, 1688, 2097,
    2099,
  ];
  const monsterMiniBossId = [1089, 1092, 1088, 1096, 1093, 1120, 1090];
  const monstersMiniBoss = monsters
    .filter((f) => monsterMiniBossId.includes(f.id))
    .filter((m) => m.name.toLowerCase().includes(searchMiniBoss.toLowerCase()));
  const monstersStage1 = monsters
    .filter((f) => monsterStage1Id.includes(f.id))
    .filter((m) => m.name.toLowerCase().includes(searchS1.toLowerCase()));

  return (
    <main className="min-h-screen text-gray-100 p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Mini Boss</h1>
      {/* 🔍 Search Input */}
      <div className="mb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="ค้นหามอนสเตอร์ 1st Round"
          value={searchMiniBoss}
          onChange={(e) => setSearchMiniBoss(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-400 outline-none w-80"
        />
        <button
          onClick={() => setSearchMiniBoss("")}
          className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-400 text-black font-semibold"
        >
          ล้าง
        </button>
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 w-max">
          {monstersMiniBoss.map((m) => (
            <div
              key={m.name}
              className="bg-gray-600 rounded-2xl p-4 w-[500px] shrink-0 shadow-lg shadow-gray-700 border border-gray-700 hover:border-cyan-400 transition grid grid-cols-2"
            >
              <div className="flex flex-col items-center col-span-1">
                <h2 className="text-2xl font-semibold text-cyan-300">
                  {m.name} (#{m.id})
                </h2>
                <img
                  src={m.image}
                  alt={m.name}
                  className="object-contain mb-3 h-[150px] w-[200px]"
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

      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Round 1</h1>
      {/* 🔍 Search Input */}
      <div className="mb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="ค้นหามอนสเตอร์ 1st Round"
          value={searchS1}
          onChange={(e) => setSearchS1(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-400 outline-none w-80"
        />
        <button
          onClick={() => setSearchS1("")}
          className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-400 text-black font-semibold"
        >
          ล้าง
        </button>
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 w-max">
          {monstersStage1.map((m) => (
            <div
              key={m.name}
              className="bg-gray-600 rounded-2xl p-4 w-[500px] shrink-0 shadow-lg shadow-gray-700 border border-gray-700 hover:border-cyan-400 transition grid grid-cols-2"
            >
              <div className="flex flex-col items-center col-span-1">
                <h2 className="text-2xl font-semibold text-cyan-300">
                  {m.name} (#{m.id})
                </h2>
                <img
                  src={m.image}
                  alt={m.name}
                  className="object-contain mb-3 h-[150px] w-[200px]"
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
