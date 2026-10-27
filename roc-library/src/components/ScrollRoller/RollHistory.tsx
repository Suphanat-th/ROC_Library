import type { Prize, RollHistoryEntry } from "@/types/scroll";
import PrizeImage from "./PrizeImage";
import { TIER_ORDER, TIER_STYLE } from "./tierStyles";

interface Props {
  entries: RollHistoryEntry[];
  onClear: () => void;
}

export default function RollHistory({ entries, onClear }: Props) {
  const groups = new Map<string, { prize: Prize; count: number }>();
  for (const { prize } of entries) {
    const group = groups.get(prize.id);
    if (group) group.count += 1;
    else groups.set(prize.id, { prize, count: 1 });
  }
  // Rarest first (lowest drop rate on top).
  const sorted = [...groups.values()].sort((a, b) => a.prize.rate - b.prize.rate);

  const tierCounts = TIER_ORDER.map((tier) => ({
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
        {tierCounts.map(({ tier, count }) => (
          <span
            key={tier}
            className={`badge badge-lg gap-1 border-0 font-bold ${
              count === 0 ? "bg-base-200 text-base-content/40" : TIER_STYLE[tier].solid
            }`}
          >
            {tier} × {count}
          </span>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-base-content/60">
          ยังไม่มีประวัติ — ประวัติจะหายเมื่อออกจากหน้านี้
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
          {sorted.map(({ prize, count }) => {
            const style = TIER_STYLE[prize.tier];
            const rare = prize.tier === "SSR" || prize.tier === "SR";
            return (
              <li
                key={prize.id}
                className={`grid grid-cols-[auto_1fr_auto] grid-rows-2 items-center gap-x-3 rounded-lg px-2 py-1.5 ${rare ? style.bgStrong : style.bg}`}
              >
                <PrizeImage
                  src={prize.image}
                  size={48}
                  className="row-span-2 self-center"
                />
                <span className={`min-w-0 truncate text-sm ${rare ? "font-bold" : ""}`}>{prize.name}</span>
                <div className="row-span-2 self-center text-right">
                  <div className={`text-2xl font-bold tabular-nums leading-none ${rare ? style.text : ""}`}>
                    × {count.toLocaleString()}
                  </div>
                  {prize.quantity > 1 && (
                    <div className="mt-1 text-xs text-base-content/60">
                      {(count * prize.quantity).toLocaleString()} ชิ้น
                    </div>
                  )}
                </div>
                <span className="text-xs tabular-nums text-base-content/60">
                  <span className={`font-bold ${style.text}`}>{prize.tier}</span> · {prize.rate.toFixed(2)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
