import { EXCHANGE_COST } from "@/services/anniversary/anniversaryService";

interface SelectionSummaryProps {
  /** how many different rewards are picked */
  kinds: number;
  /** how many exchanges in all (a reward can be picked more than once) */
  count: number;
  onOpen: () => void;
  onClear: () => void;
}

/** Bar pinned to the bottom of the screen: the running total, and the way into the full summary. */
export default function SelectionSummary({ kinds, count, onOpen, onClear }: SelectionSummaryProps) {
  if (count === 0) return null;
  const tickets = count * EXCHANGE_COST.gachaTickets;
  const zeny = count * EXCHANGE_COST.zeny;

  return (
    <div
      role="status"
      className="sticky bottom-3 z-30 mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-2xl border-2 border-(--anv-orange) bg-base-100 px-5 py-3 shadow-xl"
    >
      <p className="font-bold">
        เลือก {kinds} รายการ ({count} ชิ้น)
      </p>
      <p className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-info px-4 py-1.5 text-lg font-black text-info-content">
          Ticket ×{tickets.toLocaleString("en-US")}
        </span>
        <span className="rounded-full bg-warning px-4 py-1.5 text-lg font-black text-warning-content">
          {zeny.toLocaleString("en-US")} Zeny
        </span>
      </p>
      <div className="flex gap-2">
        <button type="button" className="btn btn-sm btn-outline" onClick={onClear}>
          ล้าง
        </button>
        <button
          type="button"
          className="btn btn-sm border-0 bg-(--anv-orange) text-(--anv-ink)"
          onClick={onOpen}
        >
          ดูสรุป
        </button>
      </div>
    </div>
  );
}
