import React from "react";
import { DungeonMapContainerProps } from "./types";
import DungeonMapHeader from "./DungeonMapHeader";
import DungeonMapControls from "./DungeonMapControls";

export default function DungeonMapContainer({
  mapName,
  mapDescription,
  mapSubtitle,
  credits,
  notes = [],
  logoPath,
  filters,
  onFilterChange,
  filterOptions,
  onReset,
  zoom,
  onZoomChange,
  children,
  additionalControls,
  showControls = true,
}: DungeonMapContainerProps) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100 p-4">
      {/* Header */}
      <DungeonMapHeader
        title={mapName}
        description={mapDescription}
        subtitle={mapSubtitle}
        credits={credits}
        notes={notes}
        logoPath={logoPath}
      />

      {/* Additional Controls (Select Map, etc.) */}
      {additionalControls}

      {/* Controls */}
      <DungeonMapControls
        filters={filters}
        onFilterChange={onFilterChange}
        filterOptions={filterOptions}
        onReset={onReset}
        zoom={zoom}
        onZoomChange={onZoomChange}
        showZoomReset={showControls}
      />

      {/* Map Container */}
      <div className="flex-1 rounded-lg overflow-hidden shadow-lg bg-gray-200 min-h-96">
        {children}
      </div>
    </div>
  );
}
