"use client";

import { useEffect, useRef, useState } from "react";
import { parseGnd } from "@/utils/gndParser";
import { parseGat } from "@/utils/gatParser";
import { createMapScene, type ColorMode, type MapScene } from "./mapScene";

interface MapViewerProps {
  /** Folder under public/assets/map/ that holds the map's files. */
  folder: string;
  /** File name shared by the map's .gnd and .gat files, without extension. */
  name: string;
  title: string;
}

type Status = "loading" | "ready" | "error";

const MODES: { value: ColorMode; label: string }[] = [
  { value: "map", label: "แมพ (ดำ)" },
  { value: "texture", label: "พื้นผิวจริง" },
];

async function fetchBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`โหลดไฟล์ไม่สำเร็จ (${response.status})`);
  return response.arrayBuffer();
}

export default function MapViewer({ folder, name, title }: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<MapScene | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<ColorMode>("map");
  const [showWalkable, setShowWalkable] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [textureCount, setTextureCount] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let observer: ResizeObserver | null = null;
    const base = `/assets/map/${folder}`;

    (async () => {
      try {
        const [gndBuffer, gatBuffer] = await Promise.all([
          fetchBuffer(`${base}/${name}.gnd`),
          fetchBuffer(`${base}/${name}.gat`),
        ]);
        if (cancelled) return;
        const scene = createMapScene(container, parseGnd(gndBuffer), parseGat(gatBuffer), `${base}/texture`);
        sceneRef.current = scene;
        scene.setShowWalkable(true);
        scene.setShowEdges(true);
        observer = new ResizeObserver(() => scene.resize());
        observer.observe(container);
        setStatus("ready");
        scene.texturesLoaded.then((count) => {
          if (!cancelled) setTextureCount(count);
        });
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "เปิดแมพไม่สำเร็จ");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [folder, name]);

  const changeMode = (next: ColorMode) => {
    setMode(next);
    sceneRef.current?.setMode(next);
  };

  const toggleWalkable = (show: boolean) => {
    setShowWalkable(show);
    sceneRef.current?.setShowWalkable(show);
  };

  const toggleEdges = (show: boolean) => {
    setShowEdges(show);
    sceneRef.current?.setShowEdges(show);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex flex-wrap items-center gap-4">
        <div className="join">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              disabled={status !== "ready" || (m.value === "texture" && !textureCount)}
              className={`btn btn-sm join-item ${mode === m.value ? "btn-primary" : "btn-outline"}`}
              onClick={() => changeMode(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={showWalkable}
            disabled={status !== "ready"}
            onChange={(e) => toggleWalkable(e.target.checked)}
          />
          ช่องเดินได้
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={showEdges}
            disabled={status !== "ready"}
            onChange={(e) => toggleEdges(e.target.checked)}
          />
          เส้นขอบ
        </label>
      </div>

      {textureCount === 0 && (
        <p className="text-sm text-base-content/60">
          ยังไม่มีรูปพื้นผิวของแมพนี้ จึงเลือกโหมดพื้นผิวจริงไม่ได้
        </p>
      )}

      <div className="relative h-[70vh] min-h-96 overflow-hidden rounded-2xl border border-base-content/10 bg-base-300">
        <div ref={containerRef} className="h-full w-full touch-none" />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center gap-3">
            <span className="loading loading-spinner" aria-hidden="true" />
            กำลังโหลดแมพ...
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-error">
            {error}
          </div>
        )}
      </div>

      <p className="text-xs text-base-content/60">
        ลาก = หมุน, ล้อเมาส์หรือถ่างนิ้ว = ซูม, ลากปุ่มขวาหรือสองนิ้ว = เลื่อน ตอนนี้แสดงเฉพาะภูมิประเทศ ยังไม่มีวัตถุ เช่น ต้นไม้และตึก
      </p>
    </div>
  );
}
