import React from "react";
import { DungeonMapControlsProps } from "./types";

export default function DungeonMapControls({
  filters,
  onFilterChange,
  filterOptions,
  onReset,
  additionalControls,
  zoom,
  onZoomChange,
  minZoom = 0,
  maxZoom = 3,
  showZoomReset = true,
}: DungeonMapControlsProps & { showZoomReset?: boolean }) {
  const handleZoomIn = () => {
    if (zoom !== undefined && onZoomChange && zoom < maxZoom) {
      onZoomChange(zoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoom !== undefined && onZoomChange && zoom > minZoom) {
      onZoomChange(zoom - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 md:p-4 bg-gray-900 border-b border-gray-700">
      {/* Additional Controls (Map Selector, etc) */}
      {additionalControls && (
        <div>{additionalControls}</div>
      )}

      {/* Filter Controls */}
      <fieldset className="border border-gray-700 rounded-lg p-3">
        <legend className="px-2 font-semibold text-sm text-gray-200">
          Filter
        </legend>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() =>
                onFilterChange(option.key, !filters[option.key])
              }
              className={`btn btn-sm ${
                filters[option.key] ? `btn-${option.color}` : "btn-ghost"
              }`}
            >
              <span>
                {option.icon} {option.label}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Control Panel */}
      {showZoomReset && (
        <fieldset className="border border-gray-700 rounded-lg p-3">
          <legend className="px-2 font-semibold text-sm text-gray-200">
            Controls
          </legend>
          <div className="flex flex-wrap items-center gap-3">
            {/* Zoom Controls */}
            {zoom !== undefined && onZoomChange && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= minZoom}
                  className="btn btn-sm btn-outline btn-primary gap-2"
                >
                  🔍-
                </button>
                <span className="text-gray-300 min-w-12 text-center">
                  {zoom}
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= maxZoom}
                  className="btn btn-sm btn-outline btn-primary gap-2"
                >
                  🔍+
                </button>
              </div>
            )}

            {/* Reset Button */}
            {onReset && (
              <button
                onClick={onReset}
                className="btn btn-sm btn-outline btn-secondary gap-2"
              >
                🔄 Reset
              </button>
            )}
          </div>
        </fieldset>
      )}
    </div>
  );
}
