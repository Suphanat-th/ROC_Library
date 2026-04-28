"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { DungeonMapContainer, MapFilter } from "@/components/DungeonMap";
import { toyFactoryMergedMapData } from "@/services/mapData/toyFactoryData";

// Dynamically import the map component with SSR disabled
const ToyFactoryMap = dynamic(() => import("./ToyFactoryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

const filterOptions: MapFilter[] = [
  { label: "Warp", icon: "🔵", color: "primary", key: "warp" },
  { label: "Treasure", icon: "🗺️", color: "warning", key: "treasure" },
  { label: "Mini Boss", icon: "⚔️", color: "error", key: "miniBoss" },
  { label: "Boss", icon: "👑", color: "secondary", key: "boss" },
  { label: "Worker", icon: "👷", color: "info", key: "worker" },
  { label: "NPC", icon: "💬", color: "ghost", key: "npc" },
  { label: "Paths", icon: "📏", color: "success", key: "paths" },
];

const guideLineColorFilters = [
  { label: "All", color: "gray-500", key: "all" },
  { label: "Cyan (Map 1)", color: "cyan-500", key: "cyan" },
  { label: "Red (Map 2 เดินไปคุย Employee Box)", color: "red-500", key: "red" },
  { label: "Green (Map 2 เดินคุย Worker)", color: "green-500", key: "green" },
  { label: "Blue (Map 3 เดินไปคุย Sanda ปล่อยชืแก)", color: "blue-500", key: "blue" },
  { label: "White (Map 3 เดินไปกำจัด Antonio และ Celine)", color: "black", key: "white" },
  { label: "Yellow (Map 4 ไปห้องสมบัติ)", color: "yellow-500", key: "yellow" },
];

export default function ToyFactoryGuidePage() {
  const [selectedMap, setSelectedMap] = useState(0); // 0 = all, 1-4 = specific map
  const [filters, setFilters] = useState({
    warp: true,
    treasure: true,
    miniBoss: true,
    boss: true,
    worker: true,
    npc: true,
    paths: true,
  });
  const [guideLineColors, setGuideLineColors] = useState({
    blue: true,
    white: true,
    yellow: true,
    cyan: true,
    red: true,
    green: true,
  }); // Filter by guide line colors (can select multiple)

  const [zoom, setZoom] = useState(0);

  const handleFilterChange = (filterKey: string, value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleGuideLineColorChange = (colorKey: string, value: boolean) => {
    if (colorKey === "all") {
      // If "All" is clicked, toggle all colors
      const newColors = {
        blue: value,
        white: value,
        yellow: value,
        cyan: value,
        red: value,
        green: value,
      };
      setGuideLineColors(newColors);
    } else {
      // Update individual color
      setGuideLineColors((prev) => ({
        ...prev,
        [colorKey]: value,
      }));
    }
  };

  // Check if all colors are selected
  const areAllColorsSelected = Object.values(guideLineColors).every(v => v === true);
  const areAnyColorsSelected = Object.values(guideLineColors).some(v => v === true);

  const handleReset = () => {
    setZoom(0);
    setSelectedMap(0);
    setGuideLineColors({
      blue: true,
      white: true,
      yellow: true,
      cyan: true,
      red: true,
      green: true,
    });  // All colors selected by default
    setFilters({
      warp: true,
      treasure: true,
      miniBoss: true,
      boss: true,
      worker: true,
      npc: true,
      paths: true,
    });
  };

  return (
    <DungeonMapContainer
      mapName="🗺️ Toy Factory Guide"
      mapSubtitle="Interactive map with boss & mini-boss locations"
      logoPath="/assets/images/horrortoyfactory/logo.webp"
      credits="ขอบคุณข้อมูลจาก Orawanpanmit"
      notes={[
        "1.คุยกับ <span class='underline'>Catherine</span> เพื่อเริ่มต้น และ รอคุยกับ <span class='underline'>Employee Box</span> เพื่อทำการแปลงร่าง <p class='badge badge-warning'>ถ้าไม่แปลงร่างจะมีทหารรับจ้าง Spawn เกิดมาเรื่อยๆ</p><br>หลังจากแปลงร่างแล้ว ให้กำจัด Monster ภายใน Map1 ให้หมด โดยเดินตามเส้นสีฟ้า <kbd class='kbd bg-cyan-500'>- -</kbd>",
        "หลังจากกำจัด Monster ใน Map1 หมดแล้ว ไปคุยกับ <span class='underline'>Cookies</span> จากนั้นแปลงร่ายเป็น <span class='underline'>Employee Box</span> เพื่อเข้าไปใน Map2",
        "2. ใน Map2 ให้คุยกับ <span class='underline'>Catherine</span> เพื่อดำเนินเรื่องต่อ จากนั้นให้แปลงร่างเป็น <span class='underline'>Employee Box</span> แล้วก็เดินตามเส้นสีแดง <kbd class='kbd bg-red-500'>- -</kbd> ",
        "พอลงมาถึงปลายเส้นสีแดงแล้ว ให้คุยกับ  <span class='underline'>Employee Box</span> ที่อยู่ฝั่งซ้ายนอกกำแพง (Employee Box ตัวแรกใน Map 1) แล้วก็เดินตามเส้นสีเขียว <kbd class='kbd bg-green-500'>- -</kbd>",
        "หลังจากคุยแล้ว เวลาในการแปลร่างจะลดลง จากนั้นให้คุยกับ <span class='underline'>Worker</span> แล้วเลือกข้อ 2 จากนั้นก็ตาม Guide Line สีเขียวไปเรื่อยๆ และคุยกับ Worker ทุกตัวที่เจอ",
        "3. หลังจากเข้า Warp ให้เดินกลับและเดินตามเส้นสีน้ำเงิน <kbd class='kbd bg-blue-700'>- -</kbd> เพื่อไปยัง Map3 เพื่อทำการ แก้มัดเชือก <span class='underline'>Captured Santa</span>",
        "พอ Warp ซ้ายเปิด ให้ทำการเดินตามเส้นสีขาว <kbd class='kbd bg-white'>- -</kbd> เพื่อไปกำจัด <span class='underline'>Antonio</span> จากนั้นให้กลับมาห้องเดิน ตามเส้นสีขาวอีกครั้งเพื่อไปกำจัด <span class='underline'>Celine</span>",
        "4.หลังจากกำจัด <span class='underline'>Celine</span> แล้ว ให้เดินตามเส้นสีเหลือง <kbd class='kbd bg-yellow-500'>- -</kbd> เพื่อไปยังห้องสมบัติ",
      ]}
      filters={filters}
      onFilterChange={handleFilterChange}
      filterOptions={filterOptions}
      onReset={handleReset}
      zoom={zoom}
      onZoomChange={setZoom}
      showControls={false}
      additionalControls={
        <div className="bg-gray-900 p-3 botder-b border-gray-700 space-y-3">
          {/* Map Selection */}
          <fieldset className="border border-gray-700 rounded-lg p-3">
            <legend className="px-2 font-semibold text-sm text-gray-200">
              Select Map
            </legend>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedMap(0)}
                className={`btn btn-sm ${
                  selectedMap === 0 ? "btn-primary" : "btn-outline"
                }`}
              >
                All Maps
              </button>
              {[1, 2, 3, 4].map((mapNum) => (
                <button
                  key={mapNum}
                  onClick={() => setSelectedMap(mapNum)}
                  className={`btn btn-sm ${
                    selectedMap === mapNum ? "btn-primary" : "btn-outline"
                  }`}
                >
                  Map {mapNum}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Guide Line Color Filter */}
          {filters.paths && (
            <fieldset className="border border-gray-700 rounded-lg p-3">
              <legend className="px-2 font-semibold text-sm text-gray-200">
                Guide Line Color
              </legend>
              <div className="space-y-2">
                {guideLineColorFilters.map((filter) => {
                  const isAllCheckbox = filter.key === "all";
                  const isChecked = isAllCheckbox ? areAllColorsSelected : (guideLineColors[filter.key as keyof typeof guideLineColors] ?? true);
                  const isIndeterminate = isAllCheckbox && areAnyColorsSelected && !areAllColorsSelected;
                  
                  return (
                    <div key={filter.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`color-${filter.key}`}
                        checked={isChecked}
                        ref={(input) => {
                          if (input && isIndeterminate) {
                            input.indeterminate = true;
                          }
                        }}
                        onChange={(e) =>
                          handleGuideLineColorChange(filter.key, e.target.checked)
                        }
                        className="checkbox checkbox-warning"
                      />
                      <label
                        htmlFor={`color-${filter.key}`}
                        className="label cursor-pointer flex-1 gap-2"
                      >
                        <span className={`badge  bg-${filter.color}`}>
                          {filter.label}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>
      }
    >
      <ToyFactoryMap
        mapData={toyFactoryMergedMapData}
        filters={filters}
        zoom={zoom}
        selectedMap={selectedMap}
        guideLineColors={guideLineColors}
      />
    </DungeonMapContainer>
  );
}
