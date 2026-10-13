"use client";

import { useSyncExternalStore } from "react";
import { getMaintenanceState } from "@/config/maintenanceWindow";
import { getRateStatus } from "@/services/serverInfo/rateStatus";
import { expService } from "@/services/serverInfo/expService";
import { dropService } from "@/services/serverInfo/dropService";
import { deathService } from "@/services/serverInfo/deathService";
import RateColumn from "./RateColumn";
import {
  formatDuration,
  formatThaiClock,
  formatThaiDateTime,
  formatThaiDay,
} from "./format";

// The clock ticks once a minute; null on the server so hydration matches.
const subscribe = (onTick: () => void) => {
  const id = setInterval(onTick, 30_000);
  return () => clearInterval(id);
};
const getNow = () => Math.floor(Date.now() / 60_000) * 60_000;
const getServerNow = () => null;

function MaintenanceStrip({ now }: { now: number | null }) {
  if (now === null) {
    return (
      <div
        role="status"
        className="border-b border-base-300 bg-base-200 px-4 py-3 text-sm sm:px-5"
      >
        กำลังตรวจสอบสถานะเซิร์ฟเวอร์…
      </div>
    );
  }

  const date = new Date(now);
  const { inMaintenance, current, next } = getMaintenanceState(date);

  return (
    <div
      role="status"
      className={`flex flex-col gap-1 border-b border-base-300 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 ${
        inMaintenance ? "bg-error/10" : "bg-success/10"
      }`}
    >
      <p className="flex items-center gap-2 text-base font-bold">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full ${
            inMaintenance ? "bg-error" : "bg-success"
          }`}
        />
        {inMaintenance ? "Server Off · ปิดปรับปรุง" : "Server On · เปิดให้บริการ"}
      </p>
      <p className="text-sm text-base-content/80">
        {inMaintenance && current
          ? `กลับมาเวลา ${formatThaiClock(current.end)} น. (อีก ${formatDuration(
              current.end.getTime() - now,
            )})`
          : next
            ? `ปิดปรับปรุงครั้งถัดไป ${formatThaiDay(next.start)} ${formatThaiClock(
                next.start,
              )}–${formatThaiClock(next.end)} น. (อีก ${formatDuration(
                next.start.getTime() - now,
              )})`
            : "ไม่มีกำหนดปิดปรับปรุง"}
      </p>
    </div>
  );
}

export default function ServerInfo() {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  const date = now === null ? null : new Date(now);

  const exp = date ? getRateStatus(expService(), date) : null;
  const drop = date ? getRateStatus(dropService(), date) : null;
  const death = date ? getRateStatus(deathService(), date) : null;

  return (
    <div className="flex w-full justify-center">
      <section
        aria-labelledby="server-info-heading"
        className="w-full max-w-5xl overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm"
      >
        <div className="flex flex-col gap-2 border-b border-base-300 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
          <div>
            <h2
              id="server-info-heading"
              className="text-xl font-bold text-base-content sm:text-2xl"
            >
              Server Info
            </h2>
            <p className="text-sm text-base-content/70">Baphomet · Moonlight</p>
          </div>
          <p className="font-mono text-sm tabular-nums text-base-content/80">
            {date ? `${formatThaiDateTime(date)} · GMT+7` : "—"}
          </p>
        </div>

        <MaintenanceStrip now={now} />

        <div className="grid divide-y divide-base-300 md:grid-cols-3 md:divide-x md:divide-y-0">
          <RateColumn
            kind="exp"
            label="EXP"
            caption="ค่าประสบการณ์"
            tagClass="bg-primary text-primary-content"
            status={exp}
            now={now}
          />
          <RateColumn
            kind="drop"
            label="DROP"
            caption="อัตราดรอป"
            tagClass="bg-accent text-accent-content"
            status={drop}
            now={now}
          />
          <RateColumn
            kind="death"
            label="DEATH"
            caption="โทษตาย"
            tagClass="bg-error text-error-content"
            status={death}
            now={now}
          />
        </div>
      </section>
    </div>
  );
}
