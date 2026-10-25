"use client";
import { Search, X } from "lucide-react";
import { PatchItemsDto } from "@/types/patch";

const FALLBACK_IMAGE = "/assets/images/GuildImage/dog.jpg";

type Entry = [string, PatchItemsDto];

interface ItemPickerProps {
  entries: Entry[];
  /** How many items the patch holds before the search narrows the list. */
  total: number;
  selectedKey: string | undefined;
  onSelect: (key: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

function Thumbnail({ patchKey }: { patchKey: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/images/PatchImage/${patchKey}.bmp`}
      alt=""
      width={40}
      height={56}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK_IMAGE;
      }}
      className="h-14 w-10 shrink-0 rounded-md bg-base-100 object-contain"
    />
  );
}

/**
 * Search plus the patch's items. From the lg width it is a list that stays beside the
 * stage; below that it folds into a single dropdown so the card keeps the screen.
 */
export default function ItemPicker({
  entries,
  total,
  selectedKey,
  onSelect,
  query,
  onQueryChange,
}: ItemPickerProps) {
  const searching = query.trim() !== "";

  return (
    <div className="space-y-3 lg:sticky lg:top-20">
      <div className="flex items-center gap-2">
        <label className="input input-bordered flex min-h-11 w-full items-center gap-2">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 opacity-60" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ค้นหาชื่อไอเทม"
            aria-label="ค้นหาชื่อไอเทม"
            className="grow"
          />
        </label>
        {searching && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="ล้างคำค้นหา"
            className="btn btn-ghost btn-square min-h-11 min-w-11"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      <p role="status" className="text-xs text-base-content/60">
        {searching
          ? `พบ ${entries.length} จาก ${total} ไอเทม`
          : `${total} ไอเทมในแพตช์นี้`}
      </p>

      {entries.length === 0 ? (
        <p className="rounded-box border border-dashed border-base-300 p-4 text-center text-sm text-base-content/70">
          {total === 0
            ? "ยังไม่มีข้อมูลไอเทมในแพตช์นี้"
            : "ไม่พบไอเทมที่ตรงกับคำค้นหา"}
        </p>
      ) : (
        <>
          {/* Narrow screens: one dropdown. */}
          <select
            aria-label="เลือกไอเทม"
            value={selectedKey}
            onChange={(e) => onSelect(e.target.value)}
            className="select select-bordered min-h-11 w-full lg:hidden"
          >
            {entries.map(([key, item]) => (
              <option key={key} value={key}>
                {item.identifiedDisplayName}
              </option>
            ))}
          </select>

          {/* Wide screens: a list that scrolls on its own. */}
          <nav
            aria-label="รายการไอเทม"
            className="hidden max-h-[calc(100dvh-14rem)] overflow-y-auto lg:block"
          >
            <ul className="space-y-1.5 pr-1">
              {entries.map(([key, item]) => {
                const selected = key === selectedKey;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => onSelect(key)}
                      aria-current={selected ? "true" : undefined}
                      className={`flex min-h-16 w-full items-center gap-3 rounded-box border p-2 text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-transparent hover:border-base-300 hover:bg-base-100"
                      }`}
                    >
                      <Thumbnail patchKey={key} />
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-sm font-semibold text-base-content">
                          {item.identifiedDisplayName}
                        </span>
                        <span className="mt-0.5 block text-xs text-base-content/60">
                          รหัส {key}
                          {item.costume && " · Costume"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
