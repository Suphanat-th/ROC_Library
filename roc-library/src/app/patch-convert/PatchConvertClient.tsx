"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { PageSkeleton } from "@/components/Loader";

import { useItemDb } from "@/services/patchData/itemsService";
import { PatchItemsDto } from "@/types/patch";
import * as htmlToImage from "html-to-image";
import ImageConvertPage from "./image-convert";
import ItemCard from "./ItemCard";
import ItemPicker from "./ItemPicker";
import {
  CostumePreviewButton,
  CostumePreviewModal,
  useCostumeSprite,
} from "./CostumePreview";

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
  const [previewOpen, setPreviewOpen] = useState(false);
  const canPreview = useCostumeSprite(patchKey, item.costume);
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
    <section aria-labelledby={`item-title-${patchKey}`} className="min-w-0">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-base-content/60">
            รหัส {patchKey}
            {item.costume && " · Costume"}
          </p>
          <h2
            id={`item-title-${patchKey}`}
            className="text-xl font-bold text-base-content sm:text-2xl"
          >
            {item.identifiedDisplayName}
          </h2>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            {canPreview && (
              <CostumePreviewButton onOpen={() => setPreviewOpen(true)} />
            )}
            <button
              type="button"
              onClick={startExport}
              disabled={status === "busy"}
              className="btn btn-primary min-h-11 flex-1 gap-2 sm:flex-none"
            >
              {status === "busy" ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <Download aria-hidden="true" className="h-4 w-4" />
              )}
              {status === "busy" ? "กำลังสร้างภาพ..." : "Download Image"}
            </button>
          </div>
          {status === "error" && (
            <span role="alert" className="text-sm text-error">
              สร้างภาพไม่สำเร็จ ลองอีกครั้ง
            </span>
          )}
        </div>
      </div>

      {/* The board the card sits on: a quiet dot grid so the card is the only loud thing. */}
      <div className="rounded-box border border-base-300 bg-base-200 bg-[radial-gradient(color-mix(in_oklab,var(--color-base-content)_14%,transparent)_1px,transparent_1px)] bg-size-[18px_18px] p-3 sm:p-6">
        <ItemCard
          id={`item${patchKey}`}
          item={item}
          image={<ImageConvertPage patchKey={patchKey} />}
          showSponsor
        />
      </div>

      {canPreview && previewOpen && (
        <CostumePreviewModal
          patchKey={patchKey}
          name={item.identifiedDisplayName}
          onClose={() => setPreviewOpen(false)}
        />
      )}

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
  const [selected, setSelected] = useState<string>();

  const entries = Object.entries(items || {});
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? entries.filter(([, item]) =>
        item.identifiedDisplayName.toLowerCase().includes(needle),
      )
    : entries;
  // A search can hide the chosen item; fall back to the first match.
  const current = visible.find(([key]) => key === selected) ?? visible[0];

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
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
            Patch Convert
          </h1>
          <p className="mt-1 text-sm text-base-content/70">
            เลือกไอเทมจากแพตช์ แล้วกด Download Image เพื่อบันทึกการ์ดเป็น PNG
            สำหรับโพสต์
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <ItemPicker
            entries={visible}
            total={entries.length}
            selectedKey={current?.[0]}
            onSelect={setSelected}
            query={query}
            onQueryChange={setQuery}
          />

          {current ? (
            <ExportableItem
              key={current[0]}
              patchKey={current[0]}
              item={current[1]}
            />
          ) : (
            <p className="rounded-box border border-dashed border-base-300 p-10 text-center text-base-content/70">
              {entries.length === 0
                ? "ยังไม่มีข้อมูลไอเทมในแพตช์นี้"
                : "ไม่พบไอเทมที่ตรงกับคำค้นหา"}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
