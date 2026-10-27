"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { ScrollDef } from "@/types/scroll";
import PrizeImage from "./PrizeImage";

interface Props {
  scrolls: ScrollDef[];
  currentId: string;
}

/**
 * A dropdown for choosing which Scroll to simulate, each row with its picture. The choice
 * lives in the address (?scroll=<id>) so a link opens the same Scroll.
 */
export default function ScrollPicker({ scrolls, currentId }: Props) {
  const [open, setOpen] = useState(false);
  const current = scrolls.find((s) => s.id === currentId) ?? scrolls[0];

  return (
    <nav
      aria-label="เลือก Scroll"
      className="mx-auto w-full max-w-5xl px-4 pt-4"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <p className="mb-2 text-sm font-semibold text-base-content/70">
        เลือกไข่ที่จะเปิด
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex min-h-16 w-full items-center gap-3 rounded-box border border-base-300 bg-base-100 p-2 text-left"
        >
          <PrizeImage src={current.cover} size={48} />
          <span className="min-w-0 grow">
            <span className="line-clamp-2 text-sm font-semibold text-base-content">
              {current.title}
            </span>
            <span className="block text-xs text-base-content/60">
              {current.prizes.length} รางวัล
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <>
            {/* A tap anywhere outside the list closes it. */}
            <div
              aria-hidden="true"
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <ul
              aria-label="รายการ Scroll"
              className="absolute inset-x-0 z-20 mt-1 max-h-[60dvh] space-y-1 overflow-y-auto rounded-box border border-base-300 bg-base-100 p-1.5 shadow-lg"
            >
              {scrolls.map((s) => {
                const selected = s.id === currentId;
                return (
                  <li key={s.id}>
                    <Link
                      href={`/random-scroll?scroll=${s.id}`}
                      scroll={false}
                      onClick={() => setOpen(false)}
                      aria-current={selected ? "true" : undefined}
                      className={`flex min-h-16 items-center gap-3 rounded-box border p-2 transition-colors ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-transparent hover:border-base-300 hover:bg-base-200"
                      }`}
                    >
                      <PrizeImage src={s.cover} size={48} />
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-sm font-semibold text-base-content">
                          {s.title}
                        </span>
                        <span className="block text-xs text-base-content/60">
                          {s.prizes.length} รางวัล
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </nav>
  );
}
