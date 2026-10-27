"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Volume2, VolumeX } from "lucide-react";
import type { Prize, PrizeAnnouncement, RollHistoryEntry } from "@/types/scroll";
import { pickPrize } from "@/utils/scrollRoll";
import Announcements from "./Announcements";
import PrizeImage, { preloadPrizeImages } from "./PrizeImage";
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

const ROW_OPTIONS = [1, 5, 10, 20, 50, 100, 500, 1000];
const SPEEDS = [
  { label: "เร็ว", seconds: 3 },
  { label: "ธรรมดา", seconds: 5 },
];
const MAX_VISIBLE = 10; // Rows drawn on screen at once; a bigger Roll runs in rounds of this size
const BATCH_PAUSE = 600; // ms to show a finished round before the next one starts
const CELL = 112;
const STRIP_LENGTH = 60;
const WINNER_INDEX = 52;
const IDLE_SPEED = 40; // px per second
const IDLE_REPEATS = 4;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function ScrollRoller({ prizes, title, maxRows = 1000 }: Props) {
  const [rowCount, setRowCount] = useState(1);
  const [seconds, setSeconds] = useState(5);
  const [muted, setMuted] = useState(false);
  const [batchKey, setBatchKey] = useState(0);
  const [rows, setRows] = useState<RowState[]>([]);
  const [batchDone, setBatchDone] = useState(false);
  const [progress, setProgress] = useState(0);
  // idle: strips drift slowly on their own; spinning: a Roll is running; settled: the Roll has finished.
  const [mode, setMode] = useState<"idle" | "spinning" | "settled">("idle");
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const [announcements, setAnnouncements] = useState<PrizeAnnouncement[]>([]);
  const spinning = mode === "spinning";
  const visibleCount = Math.min(rowCount, MAX_VISIBLE);

  const viewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef(0);
  const settleRef = useRef<(() => void) | null>(null);
  const skipAllRef = useRef(false);
  const mutedRef = useRef(false);
  const mountedRef = useRef(true);
  const rollNoRef = useRef(0);
  const drawnRef = useRef(0); // Rows drawn so far since the page opened

  // Load every picture up front so the first Roll does not slide past empty cells.
  useEffect(() => {
    preloadPrizeImages(prizes);
  }, [prizes]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Idle strips repeat the Prize list in order, so they look the same on server and client.
  const idleStrip = Array.from(
    { length: prizes.length * IDLE_REPEATS },
    (_, k) => prizes[k % prizes.length],
  );

  useEffect(() => {
    if (mode !== "idle" || prizes.length === 0) return;
    const cycle = prizes.length * CELL;
    const positions = Array.from(
      { length: visibleCount },
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
  }, [mode, visibleCount, prizes]);

  // Writes the drawn Prizes into the history and raises an Announcement for flagged ones.
  const record = (winners: Prize[], firstRow: number, rollNo: number) => {
    const at = new Date();
    const entries: RollHistoryEntry[] = winners.map((prize, i) => ({
      key: `${rollNo}-${firstRow + i}`,
      roll: rollNo,
      row: firstRow + i + 1,
      prize,
      at,
    }));
    setHistory((h) => [...entries.reverse(), ...h]);
    const news: PrizeAnnouncement[] = entries
      .filter((e) => e.prize.announce)
      .map((e) => ({ key: e.key, roll: rollNo, row: e.row, prize: e.prize }));
    if (news.length > 0) setAnnouncements((a) => [...news, ...a]);
  };

  // Shows and spins one round of up to MAX_VISIBLE Rows. Every result is decided before the animation runs.
  const runBatch = (count: number, firstRow: number, rollNo: number) =>
    new Promise<void>((resolve) => {
      const viewWidth = viewRefs.current[0]?.clientWidth ?? 600;
      const nextRows: RowState[] = Array.from({ length: count }, () => {
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

      flushSync(() => {
        setBatchKey((k) => k + 1);
        setRows(nextRows);
        setBatchDone(false);
      });

      const apply = (p: number) => {
        nextRows.forEach((row, i) => {
          const el = stripRefs.current[i];
          if (el) el.style.transform = `translateX(${-row.offset * p}px)`;
        });
      };

      let done = false;
      const settle = () => {
        if (done) return;
        done = true;
        cancelAnimationFrame(frameRef.current);
        settleRef.current = null;
        apply(1);
        record(
          nextRows.map((r) => r.winner),
          firstRow,
          rollNo,
        );
        setBatchDone(true);
        if (!mutedRef.current) {
          const best = nextRows
            .map((r) => r.winner.tier)
            .sort((a, b) => TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b))[0];
          playWin(best);
        }
        resolve();
      };
      settleRef.current = settle;

      if (skipAllRef.current) {
        settle();
        return;
      }

      const start = performance.now();
      const duration = seconds * 1000;
      let lastCell = -1;
      let lastTick = 0;
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const p = 1 - Math.pow(1 - t, 4);
        apply(p);

        const cell = Math.floor((nextRows[0].offset * p) / CELL);
        if (cell !== lastCell) {
          lastCell = cell;
          if (!mutedRef.current && now - lastTick > 35) {
            lastTick = now;
            playTick();
          }
        }

        if (t < 1) frameRef.current = requestAnimationFrame(frame);
        else settle();
      };
      frameRef.current = requestAnimationFrame(frame);
    });

  const roll = async () => {
    if (spinning || prizes.length === 0) return;
    unlockAudio();
    skipAllRef.current = false;
    rollNoRef.current += 1;
    const rollNo = rollNoRef.current;
    const total = rowCount;
    // Rows are numbered across every Roll since the page opened, so this Roll starts after the last one.
    const base = drawnRef.current;
    drawnRef.current += total;

    setProgress(0);
    setMode("spinning");

    let done = 0;
    while (done < total && mountedRef.current) {
      if (skipAllRef.current) {
        // Skipped: draw every remaining Row at once without animation.
        const rest = Array.from({ length: total - done }, () => pickPrize(prizes));
        record(rest, base + done, rollNo);
        done = total;
        break;
      }
      const count = Math.min(MAX_VISIBLE, total - done);
      await runBatch(count, base + done, rollNo);
      done += count;
      setProgress(done);
      if (done < total && !skipAllRef.current) await sleep(BATCH_PAUSE);
    }
    if (mountedRef.current) {
      setProgress(total);
      setMode("settled");
    }
  };

  const skip = () => {
    skipAllRef.current = true;
    settleRef.current?.();
  };

  const toggleMute = () => {
    mutedRef.current = !muted;
    setMuted(!muted);
  };

  const shownStrips =
    mode === "idle"
      ? Array.from({ length: visibleCount }, () => idleStrip)
      : rows.map((row) => row.strip);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 p-4">
      <h1 className="text-center text-2xl font-bold text-primary">
        {title ?? "Random Scroll"}
      </h1>

      <Announcements
        items={announcements}
        onDismiss={(key) => setAnnouncements((a) => a.filter((x) => x.key !== key))}
        onDismissAll={() => setAnnouncements([])}
      />

      <div className="max-h-112 space-y-3 overflow-y-auto rounded-box border border-base-300 bg-base-200 p-3">
        {shownStrips.map((strip, i) => (
          <div
            key={`${mode === "idle" ? "idle" : batchKey}-${i}`}
            ref={(el) => {
              viewRefs.current[i] = el;
            }}
            className="relative h-36 shrink-0 overflow-hidden rounded-lg border border-base-300 bg-base-100"
          >
            <div
              ref={(el) => {
                stripRefs.current[i] = el;
              }}
              className="flex h-full will-change-transform"
            >
              {strip.map((p, idx) => {
                const style = TIER_STYLE[p.tier];
                const isWinner = batchDone && mode !== "idle" && idx === WINNER_INDEX;
                return (
                  <div
                    key={idx}
                    style={{ width: CELL }}
                    className={`flex h-full shrink-0 flex-col items-center justify-center gap-1 border-b-4 px-1 ${style.border} ${style.bg} ${isWinner ? "ring-2 ring-inset ring-base-content" : ""}`}
                  >
                    <PrizeImage src={p.image} size={56} />
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

      {rowCount > MAX_VISIBLE && (
        <p className="text-center text-xs text-base-content/60">
          แสดงรอบละ {MAX_VISIBLE} Row แล้วหมุนต่ออัตโนมัติจนครบ {rowCount.toLocaleString()} Row
          {mode !== "idle" && ` · สุ่มแล้ว ${progress.toLocaleString()} / ${rowCount.toLocaleString()}`}
        </p>
      )}

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
            {ROW_OPTIONS.filter((n) => n <= maxRows).map((n) => (
              <option key={n} value={n}>
                {n.toLocaleString()}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="label-text mb-1 block text-xs">เวลา Spin</span>
          <div className="join">
            {SPEEDS.map((s) => (
              <button
                key={s.seconds}
                className={`btn btn-sm join-item ${seconds === s.seconds ? "btn-primary" : ""}`}
                disabled={spinning}
                onClick={() => setSeconds(s.seconds)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={roll} disabled={spinning}>
          {spinning ? "กำลังสุ่ม..." : "สุ่ม"}
        </button>
        <button className="btn btn-outline" onClick={skip} disabled={!spinning}>
          ข้าม
        </button>
        <button
          className="btn btn-ghost btn-square btn-sm"
          onClick={toggleMute}
          aria-label={muted ? "เปิดเสียง" : "ปิดเสียง"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <RollHistory entries={history} onClear={() => setHistory([])} />
      <RateTable prizes={prizes} />
    </div>
  );
}
