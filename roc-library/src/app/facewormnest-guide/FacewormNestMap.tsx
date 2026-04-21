"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
// @ts-expect-error - leaflet CSS doesn't have type declarations
import "leaflet/dist/leaflet.css";
import { facewormNestMapData } from "@/services/mapData/facewormNestData";

interface FilterState {
  warp: boolean;
  treasure: boolean;
  miniBoss: boolean;
  boss: boolean;
  guides: boolean;
}

const MAP_BOUNDS: L.LatLngBoundsExpression = [
  [0, 0],
  [400, 400],
];

export default function FacewormNestMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const treasureMarkersRef = useRef<Map<number, L.Marker[]>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number | "all">("all");
  const [filters, setFilters] = useState<FilterState>({
    warp: true,
    treasure: true,
    miniBoss: true,
    boss: true,
    guides: true,
  });
  const guidePolylinesRef = useRef<L.Polyline[]>([]);

  const handleReset = () => {
    if (!map.current) return;
    map.current.fitBounds(MAP_BOUNDS);
  };

  const toggleFilter = (type: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create map with SimpleCoordinateSystem
    map.current = L.map(mapContainer.current, {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 3,
      zoom: 0,
      zoomControl: true,
      dragging: true,
    });

    map.current.fitBounds(MAP_BOUNDS);

    // Add map image overlay
    L.imageOverlay("/assets/images/facewormnest/map.png", MAP_BOUNDS).addTo(
      map.current,
    );

    // Create icons
    const warpIcon = L.icon({
      iconUrl: "/assets/images/facewormnest/warp.png",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    const miniBossIcon = L.icon({
      iconUrl: "/assets/images/facewormnest/mini.gif",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    const treasureIcon = L.icon({
      iconUrl: "/assets/images/facewormnest/teasure.gif",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    const bossIcon = L.icon({
      iconUrl: "/assets/images/facewormnest/boss.gif",
      iconSize: [50, 50],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    // Add warp markers
    facewormNestMapData.warp.forEach((warp) => {
      const popupContent = `
        <div class="text-sm p-2">
          <h3 class="font-bold text-base">${warp.name}</h3>
        </div>
      `;
      // Data is stored as [x, y], but Leaflet needs [lat, lng] = [y, x] for L.CRS.Simple
      const marker = L.marker([warp.coordinates[1], warp.coordinates[0]] as L.LatLngExpression, {
        icon: warpIcon,
      }).addTo(map.current!);
      marker.bindPopup(popupContent, { maxWidth: 300 });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
      markersRef.current.push(marker);
    });

    // Add mini boss markers
    facewormNestMapData.miniBosses.forEach((miniBoss) => {
      const popupContent = `
        <div class="text-sm p-2 w-50">
          <h3 class="font-bold text-base mb-2">${miniBoss.name}</h3>
          <p class="text-gray-700 text-xs mb-2"><strong>Lv:</strong> ${miniBoss.level}</p>
          <p class="text-gray-600 text-xs">${miniBoss.description}</p>
        </div>
      `;
      // Data is stored as [x, y], but Leaflet needs [lat, lng] = [y, x] for L.CRS.Simple
      const marker = L.marker([miniBoss.coordinates[1], miniBoss.coordinates[0]] as L.LatLngExpression, {
        icon: miniBossIcon,
      }).addTo(map.current!);
      marker.bindPopup(popupContent, { maxWidth: 300 });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
      markersRef.current.push(marker);
    });

    // Add treasure markers
    facewormNestMapData.treasure.forEach((treasure) => {
      const popupContent = `
        <div class="treasure-popup text-sm p-3 w-100">
          ${treasure.imagePath ? `<img src="${treasure.imagePath}" alt="${treasure.name}" class="w-full object-cover rounded mb-2 max-h-96" />` : ""}
          <h3 class="font-bold text-lg">${treasure.name}</h3>
        </div>
      `;
      // Data is stored as [x, y], but Leaflet needs [lat, lng] = [y, x] for L.CRS.Simple
      const marker = L.marker([treasure.coordinates[1], treasure.coordinates[0]] as L.LatLngExpression, {
        icon: treasureIcon,
      }).addTo(map.current!);
      marker.bindPopup(popupContent, { maxWidth: 900 });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
      markersRef.current.push(marker);

      // Group treasures by stage
      const stage = treasure.stage || 1;
      if (!treasureMarkersRef.current.has(stage)) {
        treasureMarkersRef.current.set(stage, []);
      }
      treasureMarkersRef.current.get(stage)!.push(marker);
    });

    // Add boss markers
    facewormNestMapData.bosses.forEach((boss) => {
      const popupContent = `
        <div class="text-sm p-2">
          <h3 class="font-bold text-base mb-2">${boss.name}</h3>
          <p class="text-gray-700 text-xs mb-2"><strong>Lv:</strong> ${boss.level}</p>
          <p class="text-gray-600 text-xs">${boss.description}</p>
        </div>
      `;
      // Data is stored as [x, y], but Leaflet needs [lat, lng] = [y, x] for L.CRS.Simple
      const marker = L.marker([boss.coordinates[1], boss.coordinates[0]] as L.LatLngExpression, {
        icon: bossIcon,
      }).addTo(map.current!);
      marker.bindPopup(popupContent, { maxWidth: 300 });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
      markersRef.current.push(marker);
    });

    // Mark as loaded
    setTimeout(() => setIsLoaded(true), 100);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker visibility based on filters
  useEffect(() => {
    markersRef.current.forEach((marker) => {
      const iconUrl = (marker.options.icon as L.Icon).options.iconUrl || "";
      const isOnMap =
        (marker as unknown as { _map: L.Map | null })._map !== null;

      if (iconUrl.includes("warp") && !filters.warp) {
        if (isOnMap) marker.remove();
      } else if (iconUrl.includes("mini") && !filters.miniBoss) {
        if (isOnMap) marker.remove();
      } else if (iconUrl.includes("teasure") && !filters.treasure) {
        if (isOnMap) marker.remove();
      } else if (iconUrl.includes("boss") && !filters.boss) {
        if (isOnMap) marker.remove();
      } else if (!isOnMap && map.current) {
        marker.addTo(map.current);
      }
    });
  }, [filters]);

  // Filter treasures by stage
  useEffect(() => {
    treasureMarkersRef.current.forEach((stageMarkers, stage) => {
      const isStageVisible = selectedStage === "all" || selectedStage === stage;
      stageMarkers.forEach((marker) => {
        const isOnMap =
          (marker as unknown as { _map: L.Map | null })._map !== null;
        if (!isStageVisible && isOnMap) {
          marker.remove();
        } else if (isStageVisible && !isOnMap && map.current) {
          marker.addTo(map.current);
        }
      });
    });
  }, [selectedStage]);

  // Update guide paths visibility
  useEffect(() => {
    if (!map.current) return;

    // Clear existing polylines
    guidePolylinesRef.current.forEach((polyline) => {
      polyline.remove();
    });
    guidePolylinesRef.current = [];

    // Add polylines if guides are enabled
    if (filters.guides && facewormNestMapData.paths) {
      facewormNestMapData.paths.forEach((path) => {
        // Filter by stage: show all paths when "All" selected, or match specific stage
        const isPathVisible =
          selectedStage === "all" ||
          !path.stage ||
          path.stage === selectedStage;

        if (!isPathVisible) return;

        // Guide paths use RED color
        const pathColor = "#ef4444";
        
        // Data is stored as [x, y], convert to [lat, lng] = [y, x] for Leaflet
        const leafletCoords = path.coordinates.map(([x, y]) => [y, x] as L.LatLngExpression);
        const polyline = L.polyline(leafletCoords, {
          color: pathColor,
          weight: path.weight || 3,
          opacity: 0.7,
          lineCap: "round",
          lineJoin: "round",
          dashArray: "10, 5",
        }).addTo(map.current!);

        // Animated dashed line effect
        let dashOffset = 0;
        const animate = () => {
          dashOffset = (dashOffset - 0.1) % 30;
          const pathElement = polyline.getElement() as SVGPathElement | null;
          if (pathElement) {
            pathElement.style.strokeDashoffset = `${dashOffset}`;
          }
          requestAnimationFrame(animate);
        };
        animate();

        guidePolylinesRef.current.push(polyline);
      });
    }
    
    /* ===== Path Coordinates Format =====
     * Guide paths use [x, y] coordinate arrays
     * Example: path from Warp 4 to Treasure 4.1
     * 
     * Warp Point 4:     [210, 125]  (start)
     * Midpoint:         [210, 115]  (waypoint)
     * Treasure Chest 4: [237, 110]  (endpoint)
     * 
     * Format in facewormNestData.tsx:
     * {
     *   id: "path_warp4_to_treasure41",
     *   name: "Warp 4 → Treasure 4.1",
     *   coordinates: [[210, 125], [210, 115], [237, 110]],
     *   weight: 3,
     *   stage: 4,
     * }
     * 
     * Supports 2+ points for flexible path layouts
     */
  }, [filters.guides, selectedStage]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-800">
      {/* Control Panel */}
      <div className="flex flex-col gap-3 p-3 md:p-4 bg-gray-900 border-b border-gray-700">
        {/* Filter Field */}
        <fieldset className="border border-gray-700 rounded-lg p-3">
          <legend className="px-2 font-semibold text-sm text-gray-200">Filter</legend>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleFilter("warp")}
              className={`btn btn-sm ${
                filters.warp
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
            >
              <span>🔵 Warp</span>
            </button>
            <button
              onClick={() => toggleFilter("treasure")}
              className={`btn btn-sm ${
                filters.treasure
                  ? "btn-warning"
                  : "btn-ghost"
              }`}
            >
              <span>🗺️ Treasure</span>
            </button>
            <button
              onClick={() => toggleFilter("miniBoss")}
              className={`btn btn-sm ${
                filters.miniBoss
                  ? "btn-error"
                  : "btn-ghost"
              }`}
            >
              <span>⚔️ Mini Boss</span>
            </button>
            <button
              onClick={() => toggleFilter("boss")}
              className={`btn btn-sm ${
                filters.boss
                  ? "btn-secondary"
                  : "btn-ghost"
              }`}
            >
              <span>👑 Boss</span>
            </button>
          </div>
        </fieldset>

        {/* Guide Field */}
        <fieldset className="border border-gray-700 rounded-lg p-3">
          <legend className="px-2 font-semibold text-sm text-gray-200">Guide</legend>
          <div className="flex flex-wrap items-center gap-3">
            {/* Treasure Stage Dropdown */}
            <div className="dropdown dropdown-hover">
              <button
                tabIndex={0}
                className="btn btn-sm btn-outline btn-info gap-2"
              >
                📍 {selectedStage === "all"
                  ? "All Treasure"
                  : `Map ${selectedStage}`}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-gray-800 rounded-lg w-48 text-gray-100"
              >
                <li>
                  <a
                    onClick={() => setSelectedStage("all")}
                    className={`${selectedStage === "all" ? "active bg-blue-600 text-white" : "text-gray-100 hover:bg-blue-500 hover:text-white"}`}
                  >
                    All Treasure
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSelectedStage(1)}
                    className={`${selectedStage === 1 ? "active bg-blue-600 text-white" : "text-gray-100 hover:bg-blue-500 hover:text-white"}`}
                  >
                    Map 1
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSelectedStage(2)}
                    className={`${selectedStage === 2 ? "active bg-blue-600 text-white" : "text-gray-100 hover:bg-blue-500 hover:text-white"}`}
                  >
                    Map 2
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSelectedStage(3)}
                    className={`${selectedStage === 3 ? "active bg-blue-600 text-white" : "text-gray-100 hover:bg-blue-500 hover:text-white"}`}
                  >
                    Map 3
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSelectedStage(4)}
                    className={`${selectedStage === 4 ? "active bg-blue-600 text-white" : "text-gray-100 hover:bg-blue-500 hover:text-white"}`}
                  >
                    Map 4
                  </a>
                </li>
              </ul>
            </div>

            {/* Guides Toggle Button */}
            <button
              onClick={() => toggleFilter("guides")}
              className={`btn btn-sm ${
                filters.guides
                  ? "btn-info"
                  : "btn-ghost"
              }`}
              title="Toggle guide paths"
            >
              <span>🛣️ Guides</span>
            </button>
            <div className="flex-1"></div>
            <button
              onClick={handleReset}
              className="btn btn-sm btn-outline btn-accent"
            >
              🔄 Reset
            </button>
          </div>
        </fieldset>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="flex-1" style={{ minHeight: "400px" }}>
        <style>{`
          .leaflet-popup-content-wrapper {
            border-radius: 8px;
            background-color: white;
            width: auto !important;
            max-width: min(700px, 90vw) !important;
          }
          .leaflet-popup-content {
            width: 100% !important;
            margin: 0 !important;
          }
          .leaflet-popup-tip {
            background-color: white;
          }
          /* Lower z-index for leaflet controls and layers */
          .leaflet-container {
            z-index: 10 !important;
          }
          .leaflet-control-container {
            z-index: 20 !important;
          }
          .leaflet-control {
            z-index: 20 !important;
          }
          .leaflet-popup {
            z-index: 25 !important;
          }
          .leaflet-tooltip {
            z-index: 25 !important;
          }
          .leaflet-pane {
            z-index: 15 !important;
          }
        `}</style>
        {!isLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading Faceworm Nest map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
