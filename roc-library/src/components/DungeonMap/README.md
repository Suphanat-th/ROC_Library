# DungeonMap Component

Shared reusable component for creating dungeon/map pages with filters and zoom controls.

## Components

### 1. **DungeonMapContainer** (Main Container)
The main wrapper component that combines header, controls, and children.

```typescript
<DungeonMapContainer
  mapName="🗺️ Map Name"
  mapDescription="Description"
  mapSubtitle="Subtitle"
  credits="Credit text"
  notes={["Note 1", "Note 2"]}
  filters={filters}
  onFilterChange={handleFilterChange}
  filterOptions={filterOptions}
  onReset={handleReset}
  zoom={zoom}
  onZoomChange={handleZoomChange}
  additionalControls={<YourCustomControl />}
>
  {/* Your map component */}
</DungeonMapContainer>
```

### 2. **DungeonMapHeader**
Displays the map title, description, and notes.

```typescript
<DungeonMapHeader
  title="Map Name"
  description="Description"
  subtitle="Subtitle"
  credits="Credit text"
  notes={["Note 1", "Note 2"]}
/>
```

### 3. **DungeonMapControls**
Filter buttons and zoom controls.

```typescript
<DungeonMapControls
  filters={filters}
  onFilterChange={handleFilterChange}
  filterOptions={filterOptions}
  onReset={handleReset}
  zoom={zoom}
  onZoomChange={handleZoomChange}
  additionalControls={<YourCustomControl />}
/>
```

## MapFilter Interface

Define what filters are available:

```typescript
interface MapFilter {
  label: string;      // "Warp", "Boss", etc.
  icon: string;       // "🔵", "👑", etc.
  color: string;      // "primary" | "warning" | "error" | "secondary" | etc.
  key: string;        // "warp", "boss", etc.
}

const filterOptions: MapFilter[] = [
  { label: "Warp", icon: "🔵", color: "primary", key: "warp" },
  { label: "Treasure", icon: "🗺️", color: "warning", key: "treasure" },
  { label: "Mini Boss", icon: "⚔️", color: "error", key: "miniBoss" },
  { label: "Boss", icon: "👑", color: "secondary", key: "boss" },
];
```

## Usage Example

```typescript
'use client';

import { DungeonMapContainer, MapFilter } from "@/components/DungeonMap";
import DungeonMapDisplay from "./DungeonMapDisplay";
import { useState } from "react";

export default function MyDungeonPage() {
  const filterOptions: MapFilter[] = [
    { label: "Warp", icon: "🔵", color: "primary", key: "warp" },
    { label: "Treasure", icon: "🗺️", color: "warning", key: "treasure" },
    { label: "Mini Boss", icon: "⚔️", color: "error", key: "miniBoss" },
    { label: "Boss", icon: "👑", color: "secondary", key: "boss" },
  ];

  const [filters, setFilters] = useState({
    warp: true,
    treasure: true,
    miniBoss: true,
    boss: true,
  });

  const [zoom, setZoom] = useState(0);

  const handleFilterChange = (key: string, value: boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setZoom(0);
    setFilters({
      warp: true,
      treasure: true,
      miniBoss: true,
      boss: true,
    });
  };

  return (
    <DungeonMapContainer
      mapName="🗺️ My Dungeon"
      mapDescription="Interactive dungeon map"
      credits="Data from XYZ"
      notes={["Click markers for details"]}
      filters={filters}
      onFilterChange={handleFilterChange}
      filterOptions={filterOptions}
      onReset={handleReset}
      zoom={zoom}
      onZoomChange={setZoom}
    >
      <DungeonMapDisplay filters={filters} zoom={zoom} />
    </DungeonMapContainer>
  );
}
```

## Props Reference

### DungeonMapContainerProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mapName` | string | ✅ | Title of the map/dungeon |
| `mapDescription` | string | ❌ | Detailed description |
| `mapSubtitle` | string | ❌ | Subtitle |
| `credits` | string | ❌ | Credit text |
| `notes` | string[] | ❌ | Array of notes/tips |
| `filters` | Record<string, boolean> | ✅ | Current filter state |
| `onFilterChange` | (key: string, value: boolean) => void | ✅ | Filter change handler |
| `filterOptions` | MapFilter[] | ✅ | Available filter options |
| `onReset` | () => void | ❌ | Reset handler |
| `zoom` | number | ❌ | Current zoom level |
| `onZoomChange` | (zoom: number) => void | ❌ | Zoom change handler |
| `children` | React.ReactNode | ✅ | Map component |
| `additionalControls` | React.ReactNode | ❌ | Extra control buttons |

## Features

✅ Customizable filters with icons and colors  
✅ Built-in zoom controls (+ / -)  
✅ Reset button  
✅ Header with description and notes  
✅ Responsive design  
✅ DaisyUI styling  
✅ TypeScript support  
✅ Flexible and extensible  

## Customization

### Change Filter Colors

Available colors: `primary`, `secondary`, `error`, `warning`, `info`, `success`, `ghost`, `outline`

```typescript
const filterOptions: MapFilter[] = [
  { label: "Important", icon: "⭐", color: "error", key: "important" },
  { label: "Optional", icon: "✨", color: "info", key: "optional" },
];
```

### Add Custom Controls

```typescript
<DungeonMapContainer
  {...props}
  additionalControls={
    <>
      <button className="btn btn-sm">Custom Button 1</button>
      <button className="btn btn-sm">Custom Button 2</button>
    </>
  }
>
  {children}
</DungeonMapContainer>
```

### Customize Zoom Range

```typescript
<DungeonMapContainer
  {...props}
  minZoom={0}
  maxZoom={5}  // Change max zoom level
>
  {children}
</DungeonMapContainer>
```
