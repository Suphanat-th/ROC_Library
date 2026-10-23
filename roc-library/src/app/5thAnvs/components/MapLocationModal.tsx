"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Check, Copy, MapPin, X } from "lucide-react";
import { MAPS, coordinateText, type MapCoordinate } from "@/utils/mapCoordinate";

// the 3D viewer is only fetched when a coordinate is clicked
const MapViewer = dynamic(() => import("@/components/MapViewer/MapViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center gap-3">
      <span className="loading loading-spinner" aria-hidden="true" />
      กำลังโหลดแมพ...
    </div>
  ),
});

/**
 * The map a coordinate points to, in a window, with a pin on the spot. Esc, the × button or
 * a click outside closes it (only this window, even when it was opened from another one).
 */
export default function MapLocationModal({
  coordinate,
  onClose,
}: {
  coordinate: MapCoordinate;
  onClose: () => void;
}) {
  const map = MAPS[coordinate.map];
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const [copied, setCopied] = useState(false);
  // one object for the whole life of the window, so the viewer pins the spot once
  const [marker] = useState(() => ({ x: coordinate.x, y: coordinate.y }));

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    // capture phase on window: this window takes Esc before a window it was opened from sees it
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onCloseRef.current();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      opener?.focus?.();
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coordinateText(coordinate));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // the clipboard can be blocked; the coordinate is still there to read
    }
  };

  return createPortal(
    <dialog
      open
      aria-labelledby="map-location-title"
      className="modal modal-open"
      onClick={onClose}
    >
      <div
        className="anvs modal-box flex h-[90vh] max-h-[90vh] w-[95vw] max-w-none flex-col gap-3 sm:w-[80vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <MapPin aria-hidden className="h-6 w-6 shrink-0 text-(--anv-orange)" />
          <h2 id="map-location-title" className="min-w-0 flex-1 text-lg font-black leading-snug">
            {map?.name ?? coordinate.map} · {coordinate.map} {coordinate.x}, {coordinate.y}
          </h2>
          <button type="button" className="btn btn-sm gap-2" onClick={copy}>
            {copied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
            {copied ? "คัดลอกแล้ว" : "คัดลอกพิกัด"}
          </button>
          <button
            ref={closeRef}
            type="button"
            aria-label="ปิด"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-(--anv-orange)"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1">
          {map ? (
            <MapViewer
              embedded
              folder={map.folder}
              name={coordinate.map}
              title={map.name}
              marker={marker}
              errorContent={
                <div className="space-y-2">
                  <p className="text-lg font-black">ยังไม่มีแมพ {coordinate.map} ในเว็บ</p>
                  <p className="text-base-content/70">
                    {map.name} · ตำแหน่ง X {coordinate.x}, Y {coordinate.y}
                  </p>
                </div>
              }
            />
          ) : (
            <p className="p-6 text-center text-base-content/70">ไม่รู้จักแมพ {coordinate.map}</p>
          )}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
