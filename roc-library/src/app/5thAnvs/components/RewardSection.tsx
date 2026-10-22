"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import type { PatchItemsDto } from "@/types/patch";
import { rewardLabel } from "@/services/anniversary/anniversaryService";

interface RewardSectionProps {
  /** two-digit position on the poster, e.g. "01" */
  index: string;
  title: string;
  /** every reward of this Reward type: [item id, item] */
  rewards: [string, PatchItemsDto][];
  imageSrc: (id: string) => string;
  onSelect: (id: string) => void;
}

/** One Reward type: its poster band, its own Reward search and the matching reward cards. */
export default function RewardSection({
  index,
  title,
  rewards,
  imageSrc,
  onSelect,
}: RewardSectionProps) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const shown = needle
    ? rewards.filter(([, item]) =>
        item.identifiedDisplayName.toLowerCase().includes(needle),
      )
    : rewards;

  return (
    <section aria-label={title} className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-4 border-(--anv-orange) pb-3">
        <span
          aria-hidden
          className="text-4xl font-black leading-none text-(--anv-orange)"
        >
          {index}
        </span>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <span className="rounded-full bg-(--anv-orange) px-3 py-0.5 text-sm font-bold text-(--anv-ink)">
          {needle ? `${shown.length} / ${rewards.length}` : rewards.length}
        </span>
        <label className="input input-sm ml-auto w-full sm:w-64">
          <Search aria-hidden className="h-4 w-4 opacity-60" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`ค้นหา ${title}`}
            aria-label={`ค้นหา ${title}`}
          />
          {query && (
            <button
              type="button"
              aria-label="ล้างคำค้นหา"
              className="cursor-pointer"
              onClick={() => setQuery("")}
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          )}
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-box bg-base-100 p-4 text-center text-base-content/70">
          ไม่พบไอเท็มที่ค้นหา
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map(([id, item]) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                className="group flex h-full w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-transparent bg-base-100 text-center shadow transition-all hover:border-(--anv-orange) hover:shadow-lg focus-visible:border-(--anv-orange) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--anv-orange) motion-safe:hover:-translate-y-1 gap-3 p-4"
              >
                <span className="flex h-24 w-24 items-center justify-center rounded-xl bg-linear-to-br from-(--anv-orange) to-(--anv-cream)">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc(id)}
                    alt=""
                    className="h-16 w-16 object-contain drop-shadow"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/GuildImage/dog.jpg";
                    }}
                  />
                </span>
                <span className="text-sm font-bold leading-snug">
                  {rewardLabel(item)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
