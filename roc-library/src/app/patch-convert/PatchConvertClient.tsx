"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Search, X } from "lucide-react";
import { PageSkeleton } from "@/components/Loader";

import { useItemDb } from "@/services/patchData/itemsService";
import { PatchItemsDto } from "@/types/patch";
import * as htmlToImage from "html-to-image";
import ImageConvertPage from "./image-convert";
import ItemCard from "./ItemCard";

/** Every exported PNG is laid out at this width, whatever device pressed the button. */
const EXPORT_WIDTH = 1024;

type ExportStatus = "idle" | "busy" | "error";

const waitForImages = (root: HTMLElement) =>
  Promise.all(
    Array.from(root.querySelectorAll("img")).map((img) =>
      img.complete
        ? undefined
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  );

/**
 * Touch devices get the share sheet (it has "Save Image"); everything else, and any
 * share that is refused, falls back to a normal file download.
 */
async function deliverImage(file: File, title: string) {
  const canShare =
    window.matchMedia("(pointer: coarse)").matches &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] });

  if (canShare) {
    try {
      await navigator.share({ files: [file], title });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      // Share refused (e.g. the tap's user activation expired): download instead.
    }
  }

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.download = file.name;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function ExportableItem({
  patchKey,
  item,
}: {
  patchKey: string;
  item: PatchItemsDto;
}) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exporting) return;
    let cancelled = false;

    const run = async () => {
      try {
        const node = exportRef.current?.querySelector("article");
        if (!node) throw new Error("export card missing");

        await Promise.all([document.fonts.ready, waitForImages(node)]);

        const dataUrl = await htmlToImage.toPng(node, {
          backgroundColor: "transparent",
          pixelRatio: window.innerWidth < 768 ? 2 : 3,
          cacheBust: true,
        });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `item-${patchKey}.png`, {
          type: "image/png",
        });

        await deliverImage(file, item.identifiedDisplayName);
        if (!cancelled) setStatus("idle");
      } catch {
        if (!cancelled) setStatus("error");
      } finally {
        if (!cancelled) setExporting(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [exporting, patchKey, item.identifiedDisplayName]);

  const startExport = () => {
    setStatus("busy");
    setExporting(true);
  };

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 truncate text-sm text-base-content/70">
          {item.identifiedDisplayName}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {status === "error" && (
            <span role="alert" className="text-sm text-error">
              สร้างภาพไม่สำเร็จ ลองอีกครั้ง
            </span>
          )}
          <button
            type="button"
            onClick={startExport}
            disabled={status === "busy"}
            className="btn btn-primary min-h-11 w-full gap-2 sm:w-auto"
          >
            {status === "busy" ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Download aria-hidden="true" className="h-4 w-4" />
            )}
            {status === "busy" ? "กำลังสร้างภาพ..." : "Download Image"}
          </button>
        </div>
      </div>

      <ItemCard
        id={`item${patchKey}`}
        item={item}
        image={<ImageConvertPage patchKey={patchKey} />}
        showSponsor
      />

      {/* Off-screen copy at a fixed width: only mounted while an export runs. */}
      {exporting && (
        <div
          ref={exportRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: -100000,
            width: EXPORT_WIDTH,
            pointerEvents: "none",
          }}
        >
          <ItemCard
            id={`export${patchKey}`}
            item={item}
            image={<ImageConvertPage patchKey={patchKey} />}
            showSponsor
          />
        </div>
      )}
    </section>
  );
}

export default function PatchConvertClient() {
  const { items, loading, error } = useItemDb();
  const [query, setQuery] = useState("");

  const entries = Object.entries(items || {});
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? entries.filter(([, item]) =>
        item.identifiedDisplayName.toLowerCase().includes(needle),
      )
    : entries;

  if (loading) return <PageSkeleton cards={3} />;
  if (error) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div role="alert" className="alert alert-error mx-auto max-w-5xl">
          โหลดข้อมูลไอเทมไม่สำเร็จ: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6">
      <header className="mx-auto mb-6 max-w-5xl">
        <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
          Patch Convert
        </h1>
        <p className="mt-1 text-sm text-base-content/70">
          แปลงข้อมูลไอเทมจากแพตช์เป็นการ์ดภาพสำหรับโพสต์ กด Download Image
          เพื่อบันทึกเป็น PNG
        </p>

        <div className="mt-4 flex items-center gap-2">
          <label className="input input-bordered flex min-h-11 w-full items-center gap-2 sm:max-w-sm">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 opacity-60" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อไอเทม"
              aria-label="ค้นหาชื่อไอเทม"
              className="grow"
            />
          </label>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="btn btn-ghost min-h-11 gap-1"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              ล้าง
            </button>
          )}
        </div>

        <p role="status" className="mt-2 text-xs text-base-content/60">
          {needle
            ? `พบ ${visible.length} จาก ${entries.length} ไอเทม`
            : `${entries.length} ไอเทม`}
        </p>
      </header>

      {visible.length === 0 ? (
        <p className="mx-auto max-w-5xl rounded-box border border-base-300 bg-base-100 p-6 text-center text-base-content/70">
          {entries.length === 0
            ? "ยังไม่มีข้อมูลไอเทมในแพตช์นี้"
            : "ไม่พบไอเทมที่ตรงกับคำค้นหา"}
        </p>
      ) : (
        <div className="space-y-10">
          {visible.map(([key, item]) => (
            <ExportableItem key={key} patchKey={key} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
