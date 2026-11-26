"use client";

import { useEffect, useRef, useState } from "react";
import { CostumeGender } from "@/types/costume";
import { drawCharacter, measureCharacter } from "@/utils/spriteComposer";
import { loadBody, loadHead } from "@/utils/costumeCharacter";

/**
 * A small picture of a character standing still, drawn from the game's own sprites: a job's picture in the job
 * chooser, or a Body colour in the colour chooser. Loads its sprites when it appears.
 */
export default function SpriteThumb({
  gender,
  bodyName,
  colour = 0,
  outfit = 0,
  hairStyle = 1,
  hairColour = 0,
  size = 64,
  className = "",
}: {
  gender: CostumeGender;
  bodyName: string;
  colour?: number;
  outfit?: number;
  hairStyle?: number;
  hairColour?: number;
  /** Side of the square picture, in pixels. */
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [body, head] = await Promise.all([loadBody(gender, bodyName, colour, outfit), loadHead(gender, hairStyle, hairColour)]);
      const ctx = canvasRef.current?.getContext("2d");
      if (cancelled || !body || !head || !ctx) return;
      const character = { body, head };
      const bounds = measureCharacter(character, [0]);
      if (!bounds) return;
      const width = bounds.maxX - bounds.minX || 1;
      const height = bounds.maxY - bounds.minY || 1;
      const scale = Math.min((size - 6) / width, (size - 6) / height, 2);
      const x = size / 2 - (scale * (bounds.minX + bounds.maxX)) / 2;
      const y = size / 2 - (scale * (bounds.minY + bounds.maxY)) / 2;
      drawCharacter(ctx, character, { action: 0, bodyFrame: 0, elapsed: 0 }, x, y, scale);
      setDrawn(true);
    })().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [gender, bodyName, colour, outfit, hairStyle, hairColour, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`${className} transition-opacity duration-150 ${drawn ? "opacity-100" : "opacity-0"}`}
    />
  );
}
