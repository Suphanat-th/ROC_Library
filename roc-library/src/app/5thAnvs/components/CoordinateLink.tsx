"use client";
import { useState, type ReactNode } from "react";
import { MapPin } from "lucide-react";
import { coordinateText, splitCoordinates, type MapCoordinate } from "@/utils/mapCoordinate";
import MapLocationModal from "./MapLocationModal";

const INLINE =
  "anvs-link inline-flex cursor-pointer items-center gap-1 font-mono font-bold underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--anv-orange)";

/** A map coordinate that opens its map, with a pin on the spot, when pressed. */
export default function CoordinateLink({
  coordinate,
  className = INLINE,
}: {
  coordinate: MapCoordinate;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className}
        title="ดูตำแหน่งบนแมพ"
        onClick={() => setOpen(true)}
      >
        <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
        {coordinateText(coordinate)}
      </button>
      {open && <MapLocationModal coordinates={[coordinate]} onClose={() => setOpen(false)} />}
    </>
  );
}

/** A text in which every map coordinate, such as "prt_q 156 188", is a CoordinateLink. */
export function CoordinateText({ text }: { text: string }) {
  return (
    <>
      {splitCoordinates(text).map((piece, i) =>
        typeof piece === "string" ? (
          <span key={i}>{piece}</span>
        ) : (
          <CoordinateLink key={i} coordinate={piece} />
        ),
      )}
    </>
  );
}

/** A button that opens the map with every one of several coordinates pinned and numbered. */
export function CoordinateGroupLink({
  coordinates,
  className,
  children,
}: {
  coordinates: MapCoordinate[];
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (coordinates.length === 0) return null;
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && <MapLocationModal coordinates={coordinates} onClose={() => setOpen(false)} />}
    </>
  );
}
