/**
 * Example: How to use DungeonMapContainer Component
 * 
 * This example shows how to create a dungeon map page using the shared DungeonMapContainer component.
 */

import React, { useState } from "react";
import { DungeonMapContainer, MapFilter } from "@/components/DungeonMap";

// Example component
export default function ExampleDungeonPage() {
  // 1. Define filter options
  const filterOptions: MapFilter[] = [
    { label: "Warp", icon: "🔵", color: "primary", key: "warp" },
    { label: "Treasure", icon: "🗺️", color: "warning", key: "treasure" },
    { label: "Mini Boss", icon: "⚔️", color: "error", key: "miniBoss" },
    { label: "Boss", icon: "👑", color: "secondary", key: "boss" },
  ];

  // 2. Define filter state
  const [filters, setFilters] = useState<Record<string, boolean>>({
    warp: true,
    treasure: true,
    miniBoss: true,
    boss: true,
  });

  const [zoom, setZoom] = useState(0);

  // 3. Handle filter changes
  const handleFilterChange = (filterKey: string, value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // 4. Handle zoom changes
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  // 5. Handle reset
  const handleReset = () => {
    setZoom(0);
    // Reset filters to default
    setFilters({
      warp: true,
      treasure: true,
      miniBoss: true,
      boss: true,
    });
  };

  return (
    <DungeonMapContainer
      mapName="🗺️ Dungeon Name"
      mapDescription="Interactive map with dungeon locations"
      mapSubtitle="Choose what you want to see"
      credits="ขอบคุณข้อมูลจาก [Source]"
      notes={[
        "สามารถกดคลิกดูรายละเอียด Monster",
        "ซูมแมพได้โดยใช้ปุ่ม +/-",
      ]}
      filters={filters}
      onFilterChange={handleFilterChange}
      filterOptions={filterOptions}
      onReset={handleReset}
      zoom={zoom}
      onZoomChange={handleZoomChange}
    >
      {/* Insert your map component here */}
      <div className="w-full h-full flex items-center justify-center bg-gray-300">
        <p>Your Map Component Goes Here</p>
      </div>
    </DungeonMapContainer>
  );
}

/**
 * Usage in your map component:
 * 
 * 1. Get filter state from parent:
 *    - Use context or pass as props
 *    - Check if specific filter is active: filters[filterKey]
 * 
 * 2. Update markers based on filters:
 *    useEffect(() => {
 *      markersRef.current.forEach((marker) => {
 *        const filterKey = getMarkerFilterKey(marker);
 *        if (filters[filterKey]) {
 *          marker.addTo(map.current);
 *        } else {
 *          marker.remove();
 *        }
 *      });
 *    }, [filters]);
 * 
 * 3. Use zoom for map zoom level:
 *    const mapZoom = zoom; // 0-3
 */
