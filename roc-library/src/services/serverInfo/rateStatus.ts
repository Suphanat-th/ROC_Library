import type { RateSource, ServerInfoDto } from "@/types/serverInfo";

export interface RateStatus {
  /** Base rate plus every active Rate event. */
  total: number;
  base: ServerInfoDto;
  active: ServerInfoDto[];
  /** Not started yet, soonest first. */
  upcoming: ServerInfoDto[];
}

export function getRateStatus(source: RateSource, now: Date): RateStatus {
  const active = source.events.filter(
    (e) =>
      (e.DateFrom === null || e.DateFrom <= now) &&
      (e.DateTo === null || e.DateTo >= now),
  );
  const upcoming = source.events
    .filter((e) => e.DateFrom !== null && e.DateFrom > now)
    .sort((a, b) => a.DateFrom!.getTime() - b.DateFrom!.getTime());
  const total = active.reduce(
    (sum, e) => sum + e.ratePercent,
    source.base.ratePercent,
  );
  return { total, base: source.base, active, upcoming };
}
