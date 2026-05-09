"use client";
import React, { useState, useRef, useEffect } from "react";
import { ElementBadges } from "./monster-lab-element";
import { Monster } from "@/types/monster";
import MonstersDb from "@/services/mosters/mostersDb";

const monsters: Monster[] = MonstersDb();

type StageType = "miniboss" | "stage1" | "stage2" | "stage3";

interface StageInfo {
  id: StageType;
  label: string;
  color: string;
  bgColor: string;
  badge: string;
  icon: string;
}

const STAGES: StageInfo[] = [
  {
    id: "miniboss",
    label: "Mini Boss",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    badge: "badge-warning",
    icon: "👑",
  },
  {
    id: "stage1",
    label: "Stage 1",
    color: "text-success",
    bgColor: "bg-success/10",
    badge: "badge-success",
    icon: "⚔️",
  },
  {
    id: "stage2",
    label: "Stage 2",
    color: "text-warning",
    bgColor: "bg-warning/10",
    badge: "badge-warning",
    icon: "⚡",
  },
  {
    id: "stage3",
    label: "Stage 3",
    color: "text-error",
    bgColor: "bg-error/10",
    badge: "badge-error",
    icon: "🔥",
  },
];

interface MonsterCardProps {
  monster: Monster;
}

function MonsterCard({ monster: m }: MonsterCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl border-2 border-base-300 hover:shadow-2xl hover:border-primary transition w-72 sm:w-80 md:w-96 shrink-0">
      {/* Monster Image */}
      <figure className="px-2 sm:px-4 pt-2 sm:pt-4 bg-linear-to-b from-primary/20 to-base-100 min-h-36 sm:min-h-40 md:min-h-48 flex items-center justify-center">
        <img
          src={m.image}
          alt={m.name}
          className="h-24 sm:h-32 md:h-40 w-24 sm:w-32 md:w-40 object-contain drop-shadow-lg"
        />
      </figure>

      <div className="card-body p-2 sm:p-4 md:p-6">
        {/* Title */}
        <h2 className="card-title text-sm sm:text-lg md:text-xl text-primary line-clamp-1">
          {m.name}
          <div className="badge badge-secondary text-[10px] sm:text-xs md:text-sm">
            #{m.id}
          </div>
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 my-2">
          <div className="stat py-1 sm:py-2 px-2 bg-base-200 rounded">
            <div className="stat-title text-[10px] sm:text-xs">Lv</div>
            <div className="stat-value text-base sm:text-lg text-warning">
              {m.lv}
            </div>
          </div>
          <div className="stat py-1 sm:py-2 px-2 bg-base-200 rounded">
            <div className="stat-title text-[10px] sm:text-xs">HP</div>
            <div className="stat-value text-base sm:text-lg text-error">
              {m.hp ? Number(m.hp).toLocaleString() : 0}
            </div>
          </div>
          <div className="stat py-1 sm:py-2 px-2 bg-base-200 rounded">
            <div className="stat-title text-[10px] sm:text-xs">DEF</div>
            <div className="stat-value text-base sm:text-lg text-info">
              {m.def}
            </div>
          </div>
          <div className="stat py-1 sm:py-2 px-2 bg-base-200 rounded">
            <div className="stat-title text-[10px] sm:text-xs">MDEF</div>
            <div className="stat-value text-base sm:text-lg text-info">
              {m.mdef}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-1 sm:my-2"></div>

        {/* Info */}
        <div className="space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs md:text-sm bg-base-200 p-1.5 sm:p-3 rounded">
          <div className="flex justify-between items-center gap-1">
            <span className="text-black font-semibold">เผ่า:</span>
            <span className="font-semibold text-black truncate">{m.race}</span>
          </div>
          <div className="flex justify-between items-center gap-1">
            <span className="text-black font-semibold">ธาตุ:</span>
            <span className="font-semibold text-black truncate">
              {m.property}
            </span>
          </div>
          <div className="flex justify-between items-center gap-1">
            <span className="text-black font-semibold">ขนาด:</span>
            <span className="font-semibold text-black truncate">{m.scale}</span>
          </div>
        </div>

        {/* Element Damage */}
        <div className="mt-1 sm:mt-2 md:mt-3 pt-1 sm:pt-3 border-t-2 border-base-300">
          <p className="text-[9px] sm:text-xs font-bold text-base-content/70 mb-1 sm:mb-3 line-clamp-1">
            ⚡ ความเสียหาย
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <ElementBadges element={m.element} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MonsterTablePage() {
  const [selectedStage, setSelectedStage] = useState<StageType>("miniboss");

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Mini Boss
  const [searchMiniBoss, setSearchMiniBoss] = useState("");
  const monsterMiniBossId = [1089, 1092, 1088, 1096, 1093, 1120, 1090];
  const monstersMiniBoss = monsters
    .filter((f) => monsterMiniBossId.includes(f.id))
    .filter((m) => m.name.toLowerCase().includes(searchMiniBoss.toLowerCase()));

  // Stage 1
  const [searchS1, setSearchS1] = useState("");
  const monsterStage1Id = [
    1038, 1039, 1046, 1086, 1087, 1115, 1147, 1150, 1159, 1190, 1688, 2097,
    2099,
  ];
  const monstersStage1 = monsters
    .filter((f) => monsterStage1Id.includes(f.id))
    .filter((m) => m.name.toLowerCase().includes(searchS1.toLowerCase()));

  // Stage 2
  const [searchS2, setSearchS2] = useState("");
  const monsterStage2Id = [
    1980, 1157, 1112, 1251, 2068, 1373, 2156, 1272, 1630, 1779, 1252, 1708,
  ];
  const monstersStage2 = monsters
    .filter((f) => monsterStage2Id.includes(f.id))
    .filter((m) => m.name.toLowerCase().includes(searchS2.toLowerCase()));

  // Stage 3
  const [searchS3, setSearchS3] = useState("");
  const monsterStage3Id = [
    1623, 2104, 2105, 1785, 1734, 1719, 1768, 2165, 1765, 2253, 2255, 1832,
    1874,
  ];
  const monstersStage3 = monsters
    .filter((f) => monsterStage3Id.includes(f.id))
    .filter((m) => m.name.toLowerCase().includes(searchS3.toLowerCase()));

  // Get current stage data
  const stageDataMap = {
    miniboss: {
      monsters: monstersMiniBoss,
      search: searchMiniBoss,
      setSearch: setSearchMiniBoss,
    },
    stage1: {
      monsters: monstersStage1,
      search: searchS1,
      setSearch: setSearchS1,
    },
    stage2: {
      monsters: monstersStage2,
      search: searchS2,
      setSearch: setSearchS2,
    },
    stage3: {
      monsters: monstersStage3,
      search: searchS3,
      setSearch: setSearchS3,
    },
  };

  const currentStageInfo = STAGES.find((s) => s.id === selectedStage)!;
  const currentData = stageDataMap[selectedStage];

  // Drag handlers (Mouse and Touch)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    startXRef.current =
      e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Reset scroll position when stage changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [selectedStage]);

  return (
    <main className="min-h-screen bg-linear-to-b from-base-100 to-base-200 p-2 sm:p-3 md:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1 sm:mb-2">
            Central Lab Monsters
          </h1>
          <p className="text-[12px] sm:text-sm md:text-base text-base-content/70">
            ค้นหาและดูข้อมูลมอนสเตอร์ในแต่ละรอบของ Central Lab
          </p>
        </div>

        {/* Stage Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-4">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`btn btn-sm sm:btn-md md:btn-lg gap-1 sm:gap-2 ${
                  selectedStage === stage.id
                    ? `btn-primary ${stage.bgColor}`
                    : "btn-outline"
                }`}
              >
                <span className="text-lg sm:text-xl">{stage.icon}</span>
                <span className="hidden sm:inline text-xs sm:text-base text-black">
                  {stage.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Stage Header */}
        <div
          className={`card ${currentStageInfo.bgColor} border-2 ${currentStageInfo.color} mb-6 sm:mb-8 shadow-lg`}
        >
          <div className="card-body p-3 sm:p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl">
                    {currentStageInfo.icon}
                  </span>
                  <h2
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${currentStageInfo.color}`}
                  >
                    {currentStageInfo.label}
                  </h2>
                </div>
                <p className="text-xs sm:text-base text-base-content/70">
                  พบมอนสเตอร์{" "}
                  <span className="font-bold text-primary">
                    {currentData.monsters.length}
                  </span>{" "}
                  ตัว
                </p>
              </div>
              <div
                className={`badge ${currentStageInfo.badge} badge-lg py-3 sm:py-4 text-xs sm:text-base`}
              >
                {currentData.monsters.length} ตัว
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-2 sm:gap-3">
          <div className="join w-full">
            <input
              type="text"
              placeholder={`ค้นหามอนสเตอร์ ${currentStageInfo.label}`}
              value={currentData.search}
              onChange={(e) => currentData.setSearch(e.target.value)}
              className="join-item input input-sm sm:input-md input-bordered flex-1 bg-base-100 placeholder:text-black text-black"
            />
            <button
              onClick={() => currentData.setSearch("")}
              className="join-item btn btn-sm sm:btn-md btn-outline"
            >
              ล้าง
            </button>
          </div>
          {currentData.search && (
            <div className="badge badge-info badge-md sm:badge-lg text-xs sm:text-base">
              ค้นหา: {currentData.search}
            </div>
          )}
        </div>

        {/* Monsters Horizontal Scroll */}
        {currentData.monsters.length > 0 ? (
          <div>
            {/* Scroll Indicator */}
            <div className="mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm text-base-content/60">
              <span className="hidden sm:inline">
                👉 เลื่อนซ้าย-ขวา / Swipe เพื่อดูเพิ่มเติม
              </span>
              <span className="sm:hidden">
                👉 เลื่อน / Swipe เพื่อดูเพิ่มเติม
              </span>
            </div>

            {/* Scroll Container */}
            <div className="relative">
              {/* Left Gradient Shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-linear-to-r from-base-200 to-transparent z-10 pointer-events-none rounded-lg"></div>

              {/* Right Gradient Shadow */}
              <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-linear-to-l from-base-200 to-transparent z-10 pointer-events-none rounded-lg"></div>

              {/* Scrollable Content */}
              <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`overflow-x-auto pb-1 sm:pb-2 md:pb-4 -mx-2 sm:-mx-3 md:-mx-4 lg:-mx-8 px-2 sm:px-3 md:px-4 lg:px-8 scroll-smooth [&::-webkit-scrollbar]:h-2 sm:[&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-base-100 [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/95 ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-max">
                  {currentData.monsters.map((m) => (
                    <MonsterCard key={m.id} monster={m} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <p className="text-gray-500 text-base sm:text-lg">
              ไม่พบมอนสเตอร์ที่ค้นหา
            </p>
            <button
              onClick={() => currentData.setSearch("")}
              className="btn btn-outline btn-sm sm:btn-md mt-3 sm:mt-4"
            >
              ล้างการค้นหา
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
