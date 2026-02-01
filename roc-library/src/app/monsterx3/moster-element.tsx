"use client";

import React, { useState, useMemo } from "react";
import MonstersDb from "@/services/mosters/mostersDb";
import { Monster } from "@/types/monster";

const monsters: Monster[] = MonstersDb();

export default function MonsterEcomDatabase() {
  const DateFrom = new Date(2026, 0, 28, 6, 0, 0);
  const DateTo = new Date(2026, 1, 25, 6, 0, 0);
  const [search, setSearch] = useState("");
  const [selectedRace, setSelectedRace] = useState("All");
  const [selectedMap, setSelectedMap] = useState("All");
  const [sortBy, setSortBy] = useState("exp");
  const [sortType, setSortType] = useState("desc");

  // รายชื่อ ID ที่ต้องการแสดง
  const monsterx3Ids = [
    1023, 1273, 1686, 1152, 1153, 1177, 1213, 1189, 1369, 1368, 1378, 1372,
    1376, 1386, 2313, 2314, 2316, 2309, 2310, 2312, 2315, 2311, 2478, 2479,
    2919, 2917, 2920, 1270, 2923, 2921, 2916,
  ];

  const filteredMonsters = useMemo(() => {
    return monsters
      .filter((m) => monsterx3Ids.includes(m.id))
      .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
      .filter((m) => selectedRace === "All" || m.race === selectedRace)
      .filter((m) => selectedMap === "All" || m.map.includes(selectedMap))
      .sort((a, b) => {
        // asc = 1 (a-b), desc = -1 (b-a) หรือสลับตามความถนัด
        // ในที่นี้ถ้าเลือก desc ให้เอาค่ามากไว้บน (b-a)
        const modifier = sortType === "desc" ? 1 : -1;
        let result = 0;

        if (sortBy === "hp") result = b.hp - a.hp;
        else if (sortBy === "lv") result = b.lv - a.lv;
        else if (sortBy === "exp") result = b.expUp - a.expUp;
        else if (sortBy === "job") result = b.jobUp - a.jobUp;

        // สำคัญ: ต้องนำผลต่างมาคูณกับ modifier เพื่อสลับทิศทาง
        return result * modifier;
      });
  }, [search, selectedRace, selectedMap, sortBy, sortType]);

  const races = [
    "All",
    ...new Set(
      monsters.filter((m) => monsterx3Ids.includes(m.id)).map((m) => m.race),
    ),
  ];
  const uniqueMaps = [
    "All",
    ...new Set(
      monsters
        .filter((m) => monsterx3Ids.includes(m.id))
        .flatMap((m) => m.map.split(","))
        .map((mapName) => mapName.trim())
        .filter((name) => name !== ""), // กรองชื่อว่างๆ ออก,
    ),
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans  mb-[50px]">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 sticky top-0 h-screen hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-cyan-400 tracking-tight">
          Filters
        </h2>
        <div className="space-y-8">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Search
            </label>
            <input
              type="text"
              placeholder="Monster Name..."
              className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Race
            </label>
            <div className="mt-3 flex flex-col gap-2">
              {races.map((race) => (
                <button
                  key={race}
                  onClick={() => setSelectedRace(race)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedRace === race
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  {race}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              เมือง
            </label>
            <div className="mt-3 flex flex-col gap-2">
              {uniqueMaps.map((map) => (
                <button
                  key={map}
                  onClick={() => setSelectedMap(map)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedMap.includes(map)
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  {map}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-gray-900/50 p-5 rounded-2xl border border-gray-800 backdrop-blur-sm">
          <div className="text-sm text-gray-400">
            Results:{" "}
            <span className="text-cyan-400 font-bold">
              {filteredMonsters.length}
            </span>{" "}
            Monsters
          </div>
          <div className="flex items-center gap-3">
            เริ่มต้นวันที่{" "}
            {
              DateFrom.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).replace(/\//g, " ") // เปลี่ยน / เป็นช่องว่าง
            }{" "}
            -{" "}
            {
              DateTo.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).replace(/\//g, " ") // เปลี่ยน / เป็นช่องว่าง
            }
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 uppercase font-bold">
              ค้นหาด้วย
            </span>
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-cyan-500 text-gray-200"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="hp">Max HP</option>
              <option value="lv">Base Level</option>
              <option value="exp">EXP</option>
              <option value="job">JOB</option>
            </select>
            <span className="text-xs text-gray-500 uppercase font-bold">
              เรียงลำดับ
            </span>
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-cyan-500 text-gray-200"
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="desc">มากไปน้อย</option>
              <option value="asc">น้อยไปมาก</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 justify-center">
          {filteredMonsters.map((m) => (
            <div
              key={m.id}
              className="group relative bg-gray-800 rounded-[2rem] p-8 w-full max-w-[500px] border border-gray-700 hover:border-cyan-500/50 shadow-2xl hover:shadow-cyan-900/10 transition-all duration-500"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-white group-hover:text-cyan-300 transition-colors uppercase tracking-tight">
                  {m.name}
                </h2>
                <span className="text-sm font-mono bg-gray-700/50 px-3 py-1 rounded-full text-gray-400 border border-gray-600">
                  #{m.id}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-6">
                {/* Left: Avatar & HP */}
                <div className="col-span-2 flex flex-col items-center">
                  <div className="relative w-full aspect-square bg-gray-900 rounded-3xl flex items-center justify-center p-4 mb-4 border border-gray-700/50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="max-h-full max-w-full object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    />
                  </div>
                </div>

                {/* Right: Detailed Stats */}
                <div className="col-span-3 space-y-2 py-2">
                  <StatRow label="Level" value={m.lv} color="text-yellow-400" />
                  <StatRow label="Race" value={m.race} />
                  <StatRow label="Property" value={m.property} isElement />
                  <StatRow label="Size" value={m.scale} />
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4"></div>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                    <StatRow label="DEF" value={m.def} />
                    <StatRow label="MDEF" value={m.mdef} />
                    <StatRow label="HIT" value={m.hit} color="text-green-400" />
                  </div>
                </div>
              </div>
              {/* BIG HP SECTION */}
              <div className="mt-8 pt-6 border-t border-gray-700/50 grid grid-cols-2">
                <div className="col-span-2">
                  <p className="text-3xl font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                    Health Points
                  </p>
                  <p className="text-2xl font-black text-red-500 drop-shadow-[0_2px_4px_rgba(239,68,68,0.3)] tabular-nums">
                    {Number(m.hp).toLocaleString()}
                  </p>
                </div>

                <div className="col-span-1">
                  <p className="text-3xl font-black text-gray-500">EXP</p>
                  <p className="text-2xl font-black text-purple-400 drop-shadow-[0_2px_4px_rgba(239,68,68,0.3)] tabular-nums">
                    {Number(m.expUp).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-3xl font-black text-gray-500">Job</p>
                  <p className="text-2xl font-black text-blue-500 drop-shadow-[0_2px_4px_rgba(239,68,68,0.3)] tabular-nums">
                    {Number(m.jobUp).toLocaleString()}
                  </p>
                </div>
              </div>
              {/* DYNAMIC ELEMENT SECTION */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Element Resistances & Weaknesses
                </p>
                <div className="flex flex-wrap gap-3">
                  {m.element ? (
                    Object.entries(m.element)
                      // ลบ .filter อันเดิมออก หรือเปลี่ยนเงื่อนไขตามต้องการ
                      .sort(([_, a], [__, b]) => (b as number) - (a as number))
                      .map(([el, val]) => (
                        <div
                          key={el}
                          className={`flex flex-col items-center bg-gray-900/80 border rounded-xl px-3 py-2 min-w-[70px] transition-all hover:bg-gray-800 ${
                            (val as number) > 100
                              ? "border-green-500/50"
                              : (val as number) < 100
                                ? "border-red-500/50"
                                : "border-gray-700/50"
                          }`}
                        >
                          <span
                            className={`text-[10px] font-black uppercase mb-1 ${getElementColor(el)}`}
                          >
                            {el}
                          </span>
                          <span
                            className={`text-lg font-black ${
                              (val as number) > 100
                                ? "text-red-400"
                                : (val as number) < 100
                                  ? "text-green-400"
                                  : "text-white"
                            }`}
                          >
                            {val}%
                          </span>
                        </div>
                      ))
                  ) : (
                    <span className="text-xs text-gray-600 italic">
                      No element data available
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// --- Helper Functions & Interfaces ---

function getElementColor(element: string) {
  const colors: Record<string, string> = {
    fire: "text-red-500",
    water: "text-blue-500",
    wind: "text-yellow-400",
    earth: "text-orange-600",
    holy: "text-yellow-100",
    shadow: "text-purple-900",
    ghost: "text-cyan-300",
    undead: "text-emerald-500",
    neutral: "text-gray-400",
    poison: "text-purple-400",
  };
  return colors[element.toLowerCase()] || "text-gray-400";
}

interface StatRowProps {
  label: string;
  value: string | number | undefined | null;
  color?: string;
  isElement?: boolean;
}

function StatRow({
  label,
  value,
  color = "text-white",
  isElement = false,
}: StatRowProps) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`${color} font-black text-sm ${
          isElement
            ? "bg-cyan-900/30 px-2 py-0.5 rounded-md border border-cyan-700/50 text-cyan-300 text-xs"
            : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
