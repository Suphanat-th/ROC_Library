"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
// @ts-expect-error - leaflet CSS doesn't have type declarations
import "leaflet/dist/leaflet.css";
import { ToyFactoryMapData } from "@/types/toyFactory";
import { map1Bounds, map2Bounds, map3Bounds, map4Bounds } from "@/services/mapData/toyFactoryData";

interface ToyFactoryMapProps {
  mapData: ToyFactoryMapData;
  filters?: Record<string, boolean>;
  zoom?: number;
  selectedMap?: number; // 1-4, 0 means all maps
  guideLineColors?: Record<string, boolean>; // Filter by guide line colors (can select multiple)
}

const MAP_BOUNDS: L.LatLngBoundsExpression = [
  [0, 0],
  [450, 450],
];

// Color name to hex code mapping
const COLOR_MAP: Record<string, string> = {
  blue: "#1d4ed8",
  white: "#ffffff",
  cyan: "#06b6d4",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#fbbf24",
};

export default function ToyFactoryMap({ 
  mapData,
  filters = {
    warp: true,
    treasure: true,
    miniBoss: true,
    boss: true,
    worker: true,
    npc: true,
    paths: true,
  },
  zoom = 0,
  selectedMap = 0,
  guideLineColors = {
    blue: true,
    white: true,
    yellow: true,
    cyan: true,
    red: true,
    green: true,
  },
}: ToyFactoryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const pathsRef = useRef<L.Polyline[]>([]);

  // Effect 1: Initialize map (only once)
  useEffect(() => {
    if (!mapContainer.current) return;

    // Clean up if map already exists
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    map.current = L.map(mapContainer.current, {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 4,
      zoom: 0,
      zoomControl: false,
      dragging: true,
    });

    // Set initial view
    map.current.setView([200, 200], 0);
    map.current.fitBounds(MAP_BOUNDS);

    // Add all 4 map images
    L.imageOverlay("/assets/images/horrortoyfactory/map1.png", map1Bounds as L.LatLngBoundsExpression).addTo(
      map.current,
    );
    L.imageOverlay("/assets/images/horrortoyfactory/map2.png", map2Bounds as L.LatLngBoundsExpression).addTo(
      map.current,
    );
    L.imageOverlay("/assets/images/horrortoyfactory/map3.png", map3Bounds as L.LatLngBoundsExpression).addTo(
      map.current,
    );
    L.imageOverlay("/assets/images/horrortoyfactory/map4.png", map4Bounds as L.LatLngBoundsExpression).addTo(
      map.current,
    );

    return () => {
      if (map.current) {
        // Clear all layers including image overlays
        map.current.eachLayer((layer) => {
          map.current!.removeLayer(layer);
        });
        map.current.remove();
        map.current = null;
      }
      markersRef.current = [];
      pathsRef.current = [];
    };
  }, []);

  // Effect 2: Update markers when mapData changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];

    // Clear existing paths
    pathsRef.current.forEach((polyline) => {
      polyline.remove();
    });
    pathsRef.current = [];

    const warpIcon = L.icon({
      iconUrl: "/assets/images/horrortoyfactory/warp.png",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    const miniBossIcon = L.icon({
      iconUrl: "/assets/images/horrortoyfactory/mini.gif",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    const treasureIcon = L.icon({
      iconUrl: "/assets/images/horrortoyfactory/treasure.gif",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    const bossIcon = L.icon({
      iconUrl: "/assets/images/horrortoyfactory/boss.gif",
      iconSize: [50, 50],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    mapData.warp.forEach((warp) => {
      const popupContent = `
        <div class="text-sm p-2">
          <h3 class="font-bold text-base">${warp.name}</h3>
        </div>
      `;
      const marker = L.marker([warp.coordinates[1], warp.coordinates[0]] as L.LatLngExpression, {
        icon: warpIcon,
      }).addTo(map.current!);
      (marker as any).markerType = 'warp';
      marker.bindPopup(popupContent, { maxWidth: 300, autoPan: false });
      markersRef.current.push(marker);
    });

    mapData.miniBosses.forEach((miniBoss) => {
      const popupContent = `
        <div class="text-sm p-2 w-50">
          <h3 class="font-bold text-base mb-2">${miniBoss.name}</h3>
          <p class="text-gray-700 text-xs mb-2"><strong>Lv:</strong> ${miniBoss.level}</p>
          <p class="text-gray-600 text-xs">${miniBoss.description}</p>
        </div>
      `;
      const icon = L.icon({
        iconUrl: miniBoss.imagePath || "/assets/images/horrortoyfactory/mini.gif",
        iconSize: [100, 100],
        iconAnchor: [50, 50],
        popupAnchor: [0, -50],
      });
      const marker = L.marker([miniBoss.coordinates[1], miniBoss.coordinates[0]] as L.LatLngExpression, {
        icon: icon,
      }).addTo(map.current!);
      (marker as any).markerType = 'miniBoss';
      marker.bindPopup(popupContent, { maxWidth: 300, autoPan: false });
      markersRef.current.push(marker);
    });

    mapData.treasure.forEach((treasure) => {
      const popupContent = `
        <div class="treasure-popup text-sm p-3 w-100">
          ${treasure.imagePath ? `<img src="${treasure.imagePath}" alt="${treasure.name}" class="w-full object-cover rounded mb-2 max-h-96" />` : ""}
          <h3 class="font-bold text-lg">${treasure.name}</h3>
        </div>
      `;
      const marker = L.marker([treasure.coordinates[1], treasure.coordinates[0]] as L.LatLngExpression, {
        icon: treasureIcon,
      }).addTo(map.current!);
      (marker as any).markerType = 'treasure';
      marker.bindPopup(popupContent, { maxWidth: 900, autoPan: false });
      markersRef.current.push(marker);
    });

    mapData.bosses.forEach((boss) => {
      const popupContent = `
        <div class="text-sm p-2">
          <h3 class="font-bold text-base mb-2">${boss.name}</h3>
          <p class="text-gray-700 text-xs mb-2"><strong>Lv:</strong> ${boss.level}</p>
          <p class="text-gray-600 text-xs">${boss.description}</p>
        </div>
      `;
      const icon = L.icon({
        iconUrl: boss.imagePath || "/assets/images/horrortoyfactory/boss.gif",
        iconSize: [100, 100],
        iconAnchor: [50, 50],
        popupAnchor: [0, -50],
      });
      const marker = L.marker([boss.coordinates[1], boss.coordinates[0]] as L.LatLngExpression, {
        icon: icon,
      }).addTo(map.current!);
      (marker as any).markerType = 'boss';
      marker.bindPopup(popupContent, { maxWidth: 300, autoPan: false });
      markersRef.current.push(marker);
    });

    // Add NPC markers
    mapData.npcs?.forEach((npc) => {
      const popupContent = `
        <div class="npc-popup text-sm p-3 w-80 bg-gray-900 text-white rounded">
          <div class="flex items-center gap-2 mb-3">
            <img src="${npc.imagePath}" alt="${npc.name}" class="w-12 h-12 rounded-full object-cover" />
            <h3 class="font-bold text-base">${npc.name}</h3>
          </div>
          <p class="mb-3 text-gray-300">${npc.header}</p>
          <div class="space-y-1">
            ${npc.text}
          </div>
          <div id="npc-response" class="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-200 hidden"></div>
        </div>
      `;

      const marker = L.marker([npc.coordinates[1], npc.coordinates[0]] as L.LatLngExpression, {
        icon: L.icon({
          iconUrl: npc.imagePath,
          iconSize: npc.iconSize || [40, 40],
          iconAnchor: [Math.floor((npc.iconSize?.[0] || 40) / 2), Math.floor((npc.iconSize?.[1] || 40) / 2)],
          popupAnchor: [0, -Math.floor((npc.iconSize?.[1] || 40) / 2)],
        }),
      }).addTo(map.current!);

      marker.bindPopup(popupContent, { maxWidth: 400, autoPan: false });

      // Determine marker type
      let markerType = 'npc'; // default to npc for generic NPCs
      if (npc.name === "Warp") {
        markerType = 'warp';
      } else if (npc.name.includes("Celine Kimi") && npc.name.includes("ตัวปลอม")) {
        markerType = 'miniBoss';
      } else if (npc.name === "Celine (MVP)") {
        markerType = 'boss';
      } else if (npc.name.includes("Worker")) {
        markerType = 'worker';
      }

      (marker as any).markerType = markerType;

      // Add click handler for dialogue options
      marker.on("popupopen", () => {
        setTimeout(() => {
          const buttons = document.querySelectorAll(".npc-option-btn");
          const responseDiv = document.getElementById("npc-response");
          buttons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const response = (e.target as HTMLButtonElement).getAttribute(
                "data-response"
              );
              if (responseDiv && response) {
                responseDiv.textContent = response;
                responseDiv.classList.remove("hidden");
              }
            });
          });
        }, 0);
      });

      markersRef.current.push(marker);
    });

    // Add path polylines
    mapData.paths?.forEach((path) => {
      const pathCoordinates = path.coordinates.map(([x, y]) => [y, x] as L.LatLngExpression);
      const hexColor = COLOR_MAP[path.color?.toLowerCase() || "red"] || "#ef4444";
      
      const polyline = L.polyline(pathCoordinates, {
        color: hexColor,
        weight: path.weight || 2,
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

      // Store color name for filtering
      (polyline as any).pathId = path.id;
      (polyline as any).colorName = path.color?.toLowerCase() || "red";
      pathsRef.current.push(polyline);
    });
  }, [mapData]);

  // Update marker visibility based on filters
  useEffect(() => {
    markersRef.current.forEach((marker) => {
      const markerType = (marker as any).markerType;
      const isOnMap =
        (marker as unknown as { _map: L.Map | null })._map !== null;

      // Determine if this marker should be visible based on its type
      let shouldBeVisible = true;

      // Check filter based only on markerType
      switch (markerType) {
        case 'warp':
          shouldBeVisible = filters.warp;
          break;
        case 'miniBoss':
          shouldBeVisible = filters.miniBoss;
          break;
        case 'boss':
          shouldBeVisible = filters.boss;
          break;
        case 'treasure':
          shouldBeVisible = filters.treasure;
          break;
        case 'worker':
          shouldBeVisible = filters.worker;
          break;
        case 'npc':
          shouldBeVisible = filters.npc;
          break;
        default:
          shouldBeVisible = true; // Show markers without markerType
      }

      if (!shouldBeVisible && isOnMap) {
        marker.remove();
      } else if (shouldBeVisible && !isOnMap) {
        marker.addTo(map.current!);
      }
    });

    // Update path visibility based on filters
    pathsRef.current.forEach((polyline) => {
      const isOnMap = (polyline as any)._map !== null;
      const colorName = (polyline as any).colorName || "red";
      
      // Check if the color is selected in the filter
      const colorMatches = (guideLineColors[colorName as keyof typeof guideLineColors] ?? false);
      const shouldBeVisible = filters.paths && colorMatches;
      
      if (!shouldBeVisible && isOnMap) {
        map.current!.removeLayer(polyline);
      } else if (shouldBeVisible && !isOnMap) {
        polyline.addTo(map.current!);
      }
    });
  }, [filters, guideLineColors]);

  // Update zoom level
  useEffect(() => {
    if (map.current) {
      map.current.setZoom(zoom);
    }
  }, [zoom]);

  // Zoom to selected map
  useEffect(() => {
    if (!map.current) return;

    let bounds: L.LatLngBoundsExpression;
    switch (selectedMap) {
      case 1:
        bounds = map1Bounds as L.LatLngBoundsExpression;
        break;
      case 2:
        bounds = map2Bounds as L.LatLngBoundsExpression;
        break;
      case 3:
        bounds = map3Bounds as L.LatLngBoundsExpression;
        break;
      case 4:
        bounds = map4Bounds as L.LatLngBoundsExpression;
        break;
      default:
        bounds = MAP_BOUNDS;
    }
    map.current.fitBounds(bounds);
  }, [selectedMap]);

  return <div ref={mapContainer} className="w-full h-[800px] bg-gray-800" />;
}
