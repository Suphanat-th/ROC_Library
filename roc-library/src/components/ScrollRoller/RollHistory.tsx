import Image from "next/image";
import type { RollHistoryEntry } from "@/types/scroll";
import { TIER_ORDER, TIER_STYLE } from "./tierStyles";

interface Props {
  entries: RollHistoryEntry[];
  onClear: () => void;
}

export default function RollHistory({ entries, onClear }: Props) {
  // Rarest first (lowest rate); equal rates keep newest first because `entries` is already newest first.
  const sorted = [...entries].sort((a, b) => a.prize.rate - b.prize.rate);

  const counts = TIER_ORDER.map((tier) => ({
    tier,
    count: entries.filter((e) => e.prize.tier === tier).length,
  }));

  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold">ประวัติการสุ่ม ({entries.length})</h2>
        <button className="btn btn-ghost btn-xs" onClick={onClear} disabled={entries.length === 0}>
          ล้างประวัติ
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {counts.map(({ tier, count }) => (
          <span key={tier} className={`badge ${TIER_STYLE[tier].badge} ${count === 0 ? "badge-outline opacity-50" : ""}`}>
            {tier} × {count}
          </span>
        ))}
      </div>

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-base-content/60">ยังไม่มีประวัติ — ประวัติจะหายเมื่อออกจากหน้านี้</p>
      ) : (
        <ul className="max-h-96 space-y-1 overflow-y-auto">
          {sorted.map((e) => (
            <li
              key={e.key}
              className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${TIER_STYLE[e.prize.tier].bg}`}
            >
              <span className="w-10 shrink-0 text-xs text-base-content/60">#{e.roll}</span>
              <Image src={e.prize.image} alt="" width={28} height={28} unoptimized className="shrink-0" />
              <span className="min-w-0 flex-1 truncate">
                {e.prize.name} × {e.prize.quantity}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-base-content/60">{e.prize.rate.toFixed(2)}%</span>
              <span className={`shrink-0 font-bold ${TIER_STYLE[e.prize.tier].text}`}>{e.prize.tier}</span>
              <span className="hidden shrink-0 text-xs text-base-content/60 sm:inline">
                {e.at.toLocaleTimeString("th-TH")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
