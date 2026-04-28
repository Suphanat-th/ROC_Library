export interface MapMarker {
  id: string;
  name: string;
  type: 'property' | 'monster';
  coordinates: [number, number]; // [x, y]
  description: string;
  imagePath?: string;
  level?: number;
  drops?: string[];
  stage?: number;
}

export interface DialogueOption {
  id: string;
  text: string;
  response: string;
}

export interface NPC {
  id: string;
  name: string;
  coordinates: [number, number]; // [y, x]
  imagePath: string;
  header: string;
  text: string; // HTML list content
  iconSize?: [number, number]; // [width, height]
}

export interface GuidePath {
  id: string;
  name: string;
  coordinates: [number, number][];
  weight?: number;
  stage?: number;
  color?: string; // Hex color code or color name (e.g., '#FF6B35', '#FF0000', etc.)
}

export interface ToyFactoryMapData {
  mapName: string;
  center: [number, number];
  zoom: number;
  warp: MapMarker[];
  treasure: MapMarker[];
  miniBosses: MapMarker[];
  bosses: MapMarker[];
  npcs?: NPC[];
  paths?: GuidePath[];
}
