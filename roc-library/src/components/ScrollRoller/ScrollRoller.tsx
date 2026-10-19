"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import type { Prize, RollHistoryEntry } from "@/types/scroll";
import { pickPrize } from "@/utils/scrollRoll";
import RateTable from "./RateTable";
import RollHistory from "./RollHistory";
import { playTick, playWin, unlockAudio } from "./sound";
import { TIER_ORDER, TIER_STYLE } from "./tierStyles";

interface Props {
  prizes: Prize[];
  title?: string;
  /** Largest number of Rows one Roll can have. */
  maxRows?: number;
}

interface RowState {
  strip: Prize[];
  winner: Prize;
  /** How far (px) the strip slides left so the winner stops under the centre line. */
  offset: number;
}

const DURATIONS = [3, 5, 7];
const CELL = 112;
const STRIP_LENGTH = 60;
const WINNER_INDEX = 52;
const IDLE_SPEED = 40; // px per second
const IDLE_REPEATS = 4;

export default function ScrollRoller({ prizes, title, maxRows = 20 }: Props) {
  const [rowCount, setRowCount] = useState(1);
  const [seconds, setSeconds] = useState(5);
  const [muted, setMuted] = useState(false);
  const [rollId, setRollId] = useState(0);
  const [rows, setRows] = useState<RowState[]>([]);
  // idle: strips drift slowly on their own; spinning: a Roll is running; settled: results are shown.
  const [mode, setMode] = useState<"idle" | "spinning" | "settled">("idle");
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const spinning = mode === "spinning";
  const settled = mode === "settled";

  const viewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef(0);
  const settleRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // Idle strips repeat the Prize list in order, so they look the same on server and client.
  const idleStrip = Array.from(
    { length: prizes.length * IDLE_REPEATS },
    (_, k) => prizes[k % prizes.length],
  );

  useEffect(() => {
    if (mode !== "idle" || prizes.length === 0) return;
    const cycle = prizes.length * CELL;
    const positions = Array.from(
      { length: rowCount },
      (_, i) => (i * CELL * 2.5) % cycle,
    );
    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      positions.forEach((pos, i) => {
        positions[i] = (pos + IDLE_SPEED * dt) % cycle;
        const el = stripRefs.current[i];
        if (el) el.style.transform = `translateX(${-positions[i]}px)`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mode, rowCount, prizes]);

  const roll = () => {
    if (spinning || prizes.length === 0) return;
    unlockAudio();

    // The result of every Row is decided here, before any animation runs.
    const viewWidth = viewRefs.current[0]?.clientWidth ?? 600;
    const nextRows: RowState[] = Array.from({ length: rowCount }, () => {
      const winner = pickPrize(prizes);
      const strip = Array.from({ length: STRIP_LENGTH }, (_, i) =>
        i === WINNER_INDEX ? winner : pickPrize(prizes),
      );
      const jitter = (Math.random() - 0.5) * CELL * 0.7;
      return {
        strip,
        winner,
        offset: WINNER_INDEX * CELL + CELL / 2 - viewWidth / 2 + jitter,
      };
    });
    const id = rollId + 1;

    flushSync(() => {
      setRollId(id);
      setRows(nextRows);
      setMode("spinning");
    });

    const apply = (progress: number) => {
      nextRows.forEach((row, i) => {
        const el = stripRefs.current[i];
        if (el) el.style.transform = `translateX(${-row.offset * progress}px)`;
      });
    };

    let done = false;
    const settle = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(frameRef.current);
      settleRef.current = null;
      apply(1);
      const at = new Date();
      const entries = nextRows.map((row, i) => ({
        key: `${id}-${i}`,
        roll: id,
        prize: row.winner,
        at,
      }));
      setHistory((h) => [...entries.reverse(), ...h]);
      setMode("settled");
      if (!muted) {
        const best = nextRows
          .map((r) => r.winner.tier)
          .sort((a, b) => TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b))[0];
        playWin(best);
      }
    };
    settleRef.current = settle;

    const start = performance.now();
    const duration = seconds * 1000;
    let lastCell = -1;
    let lastTick = 0;
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const progress = 1 - Math.pow(1 - t, 4);
      apply(progress);

      const cell = Math.floor((nextRows[0].offset * progress) / CELL);
      if (cell !== lastCell) {
        lastCell = cell;
        if (!muted && now - lastTick > 35) {
          lastTick = now;
          playTick();
        }
      }

      if (t < 1) frameRef.current = requestAnimationFrame(frame);
      else settle();
    };
    frameRef.current = requestAnimationFrame(frame);
  };

  const shownStrips =
    mode === "idle"
      ? Array.from({ length: rowCount }, () => idleStrip)
      : rows.map((row) => row.strip);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 p-4">
      <h1 className="text-center text-2xl font-bold text-primary">
        {title ?? "Random Scroll"}
      </h1>

      <div className="space-y-3 rounded-box border border-base-300 bg-base-200 p-3">
        {shownStrips.map((strip, i) => (
          <div
            key={`${mode === "idle" ? "idle" : rollId}-${i}`}
            ref={(el) => {
              viewRefs.current[i] = el;
            }}
            className="relative h-36 overflow-hidden rounded-lg border border-base-300 bg-base-100"
          >
            <div
              ref={(el) => {
                stripRefs.current[i] = el;
              }}
              className="flex h-full will-change-transform"
            >
              {strip.map((p, idx) => {
                const style = TIER_STYLE[p.tier];
                const isWinner = settled && idx === WINNER_INDEX;
                return (
                  <div
                    key={idx}
                    style={{ width: CELL }}
                    className={`flex h-full shrink-0 flex-col items-center justify-center gap-1 border-b-4 px-1 ${style.border} ${style.bg} ${isWinner ? "ring-2 ring-inset ring-base-content" : ""}`}
                  >
                    <Image
                      src={p.image}
                      alt=""
                      width={56}
                      height={56}
                      unoptimized
                    />
                    <span className="line-clamp-2 text-center text-[11px] leading-tight">
                      {p.name}
                    </span>
                    <span className={`text-[10px] font-bold ${style.text}`}>
                      {p.tier} × {p.quantity}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-warning shadow-[0_0_8px] shadow-warning" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-base-100 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-base-100 to-transparent" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-center gap-3 rounded-box border border-base-300 bg-base-100 p-3">
        <label className="form-control">
          <span className="label-text mb-1 text-xs">จำนวน Row</span>
          <select
            className="select select-bordered select-sm"
            value={rowCount}
            disabled={spinning}
            onChange={(e) => {
              setRowCount(Number(e.target.value));
              setMode("idle");
            }}
          >
            {Array.from({ length: maxRows }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="label-text mb-1 block text-xs">เวลา Spin</span>
          <div className="join">
            {DURATIONS.map((s) => (
              <button
                key={s}
                className={`btn btn-sm join-item ${seconds === s ? "btn-primary" : ""}`}
                disabled={spinning}
                onClick={() => setSeconds(s)}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={roll} disabled={spinning}>
          {spinning ? "กำลังสุ่ม..." : "สุ่ม"}
        </button>
        <button
          className="btn btn-outline"
          onClick={() => settleRef.current?.()}
          disabled={!spinning}
        >
          ข้าม
        </button>
        <button
          className="btn btn-ghost btn-square btn-sm"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "เปิดเสียง" : "ปิดเสียง"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RollHistory entries={history} onClear={() => setHistory([])} />
        <RateTable prizes={prizes} />
      </div>
    </div>
  );
}
