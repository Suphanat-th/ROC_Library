"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { PrizeAnnouncement } from "@/types/scroll";
import { TIER_STYLE } from "./tierStyles";

interface Props {
  items: PrizeAnnouncement[];
  onDismiss: (key: string) => void;
  onDismissAll: () => void;
}

const MAX_SHOWN = 4;

// Congratulation toasts for Prizes flagged `announce`, newest on top, pinned under the Navbar.
export default function Announcements({ items, onDismiss, onDismissAll }: Props) {
  const shown = items.slice(0, MAX_SHOWN);
  const hidden = items.length - shown.length;

  return (
    <div className="toast toast-top toast-end top-20 z-50 w-96 max-w-[calc(100vw-1rem)] gap-3 p-0 pr-3">
      <AnimatePresence initial={false}>
        {shown.map((a) => {
          const style = TIER_STYLE[a.prize.tier];
          return (
            <motion.div
              key={a.key}
              layout
              role="status"
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className={`relative w-full overflow-hidden rounded-2xl border-2 bg-base-100 shadow-2xl ${style.border} ${style.glow}`}
            >
              <div className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold ${style.solid}`}>
                {/* <span aria-hidden>🎉</span> */}
                <span className="flex-1">Lucky Row !!</span>
                <button
                  className="btn btn-ghost btn-xs btn-circle -mr-2"
                  onClick={() => onDismiss(a.key)}
                  aria-label="ปิด"
                >
                  <X size={14} />
                </button>
              </div>

              <div className={`flex items-center gap-4 p-4 ${style.bg}`}>
                <div className={`grid size-16 shrink-0 place-items-center rounded-xl border-2 bg-base-100 ${style.border}`}>
                  <Image src={a.prize.image} alt="" width={48} height={48} unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-base-content/60">ได้รับไอเท็ม</p>
                  <p className="font-bold leading-tight">{a.prize.name}</p>
                  <p className="mt-1 text-xs">
                    <span className={`font-bold ${style.text}`}>
                      {a.prize.tier} · {a.prize.rate.toFixed(2)}%
                    </span>
                    <span className="text-base-content/60">
                      {" "}
                      · Row ที่ {a.row.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {items.length > 1 && (
        <button className="btn btn-sm btn-neutral self-end shadow-lg" onClick={onDismissAll}>
          {hidden > 0 ? `+${hidden} ผู้โชคดีอีก · ` : ""}ปิดทั้งหมด
        </button>
      )}
    </div>
  );
}
