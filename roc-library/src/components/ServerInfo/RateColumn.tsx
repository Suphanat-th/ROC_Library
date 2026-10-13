import type { ServerInfoDto } from "@/types/serverInfo";
import type { RateStatus } from "@/services/serverInfo/rateStatus";
import { formatDuration, formatThaiDateTime } from "./format";

export type RateKind = "exp" | "drop" | "death";

interface RateColumnProps {
  kind: RateKind;
  label: string;
  caption: string;
  tagClass: string;
  status: RateStatus | null;
  now: number | null;
}

// DEATH is the share of the death penalty that remains, so an event lowers it.
const formatDelta = (kind: RateKind, pct: number) => {
  if (kind === "death") {
    return pct < 0 ? `ลดโทษตาย ${Math.abs(pct)}%` : `เพิ่มโทษตาย ${pct}%`;
  }
  return `${pct >= 0 ? "+" : "−"}${Math.abs(pct)}%`;
};

const totalCaption = (kind: RateKind) =>
  kind === "death" ? "โทษตายคงเหลือ" : "เรตรวมตอนนี้";

function EventRow({
  kind,
  event,
  mode,
  now,
}: {
  kind: RateKind;
  event: ServerInfoDto;
  mode: "active" | "upcoming";
  now: number | null;
}) {
  const edge = mode === "active" ? event.DateTo : event.DateFrom;
  const remaining =
    edge && now !== null ? formatDuration(edge.getTime() - now) : null;

  return (
    <li className="py-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 text-sm font-semibold">{event.name}</span>
        <span className="shrink-0 font-mono text-sm font-semibold tabular-nums">
          {formatDelta(kind, event.ratePercent)}
        </span>
      </div>
      {event.description && (
        <p className="mt-0.5 text-xs text-base-content/70">
          {event.description}
        </p>
      )}
      <p className="mt-1 text-xs text-base-content/70">
        {mode === "active"
          ? edge
            ? `ถึง ${formatThaiDateTime(edge)}`
            : "ตลอดเวลา"
          : `เริ่ม ${edge ? formatThaiDateTime(edge) : "-"}`}
        {remaining && (
          <span className="font-semibold text-base-content">
            {" · "}
            {mode === "active" ? "เหลืออีก" : "อีก"} {remaining}
          </span>
        )}
      </p>
    </li>
  );
}

export default function RateColumn({
  kind,
  label,
  caption,
  tagClass,
  status,
  now,
}: RateColumnProps) {
  const headingId = `rate-${kind}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h3
          id={headingId}
          className={`rounded-field px-2 py-0.5 font-mono text-xs font-bold tracking-widest ${tagClass}`}
        >
          {label}
        </h3>
        <span className="text-xs text-base-content/70">{caption}</span>
      </div>

      <div className="mt-4">
        <p className="font-mono text-5xl font-bold leading-none tabular-nums sm:text-6xl">
          {status ? `${status.total}%` : "—"}
        </p>
        <p className="mt-2 text-sm text-base-content/70">
          {totalCaption(kind)}
          {status && status.active.length > 0 && (
            <span className="ml-2 badge badge-sm badge-outline">
              มีอีเวนต์ {status.active.length}
            </span>
          )}
        </p>
      </div>

      <div className="mt-5 border-t border-base-300 pt-3">
        <h4 className="text-xs font-semibold tracking-wide text-base-content/70">
          กำลังใช้งาน
        </h4>
        <ul className="divide-y divide-base-300">
          <li className="flex items-baseline justify-between gap-3 py-2.5 text-sm text-base-content/70">
            <span>Base rate</span>
            <span className="font-mono font-semibold tabular-nums">
              {status ? `${status.base.ratePercent}%` : "—"}
            </span>
          </li>
          {status?.active.map((event) => (
            <EventRow
              key={`${event.name}-${event.DateFrom?.getTime()}`}
              kind={kind}
              event={event}
              mode="active"
              now={now}
            />
          ))}
        </ul>
        {status && status.active.length === 0 && (
          <p className="pb-1 text-xs text-base-content/70">
            ไม่มีอีเวนต์ตอนนี้ ใช้เรต Base
          </p>
        )}
      </div>

      <div className="mt-3 border-t border-base-300 pt-3">
        <h4 className="text-xs font-semibold tracking-wide text-base-content/70">
          กำลังจะมาถึง
        </h4>
        {status && status.upcoming.length > 0 ? (
          <ul className="divide-y divide-base-300">
            {status.upcoming.map((event) => (
              <EventRow
                key={`${event.name}-${event.DateFrom?.getTime()}`}
                kind={kind}
                event={event}
                mode="upcoming"
                now={now}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-base-content/70">
            {status ? "ยังไม่มีอีเวนต์ที่ประกาศ" : "กำลังตรวจสอบ…"}
          </p>
        )}
      </div>
    </section>
  );
}
