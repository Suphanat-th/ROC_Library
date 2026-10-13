import { ChevronDown } from "lucide-react";
import type { ServerInfoDto } from "@/types/serverInfo";
import { deathService } from "@/services/serverInfo/deathService";
import { dropService } from "@/services/serverInfo/dropService";
import { expService } from "@/services/serverInfo/expService";

const formatUntil = (date: Date | null) =>
  date
    ? `ถึง ${date.toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })} น.`
    : "ตลอดเวลา";

function RateRow({
  label,
  badgeClass,
  items,
}: {
  label: string;
  badgeClass: string;
  items: ServerInfoDto[];
}) {
  const total = items.reduce((acc, curr) => acc + curr.ratePercent, 0);

  return (
    <details
      open
      className="group rounded-field border border-base-300 bg-base-100"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
        <span className={`badge badge-outline font-semibold ${badgeClass}`}>
          {label}
        </span>
        <span className="text-lg font-semibold">{total}%</span>
        <span className="text-xs text-base-content/60">
          {items.length} รายการ
        </span>
        <ChevronDown
          aria-hidden="true"
          className="ml-auto h-4 w-4 text-base-content/60 transition-transform group-open:rotate-180"
        />
      </summary>
      <ul className="divide-y divide-base-300 border-t border-base-300">
        {items.map((item, i) => (
          <li key={i} className="flex flex-col gap-0.5 px-3 py-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-base-content/60">
                {formatUntil(item.DateTo)}
              </span>
            </div>
            <p className="text-sm text-base-content/70">
              {item.description ?? "No description"}
            </p>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function ExpServerPage() {
  const exp = expService();
  const drop = dropService();
  const death = deathService();

  return (
    <div className="flex w-full flex-col gap-2">
      <RateRow label="EXP" badgeClass="badge-primary" items={exp} />
      <RateRow label="DROP" badgeClass="badge-accent" items={drop} />
      <RateRow label="DEATH" badgeClass="badge-error" items={death} />
    </div>
  );
}
