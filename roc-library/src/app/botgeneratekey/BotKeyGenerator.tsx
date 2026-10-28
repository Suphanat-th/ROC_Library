"use client";

import { useState } from "react";
import { Check, Copy, Download, KeyRound, Loader2, Lock, Trash2 } from "lucide-react";

interface LogRow {
  date: string;
  machineId: string;
  name: string;
  days: string;
}

interface Issued {
  key: string;
  expiresAt: number | null;
  row: LogRow;
}

type Status = "idle" | "busy";

const thaiDate = (seconds: number) =>
  new Date(seconds * 1000).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "long",
    timeStyle: "short",
  });

/** Same columns as the desktop tool's issued_keys.csv; the BOM lets Excel read Thai text. */
function downloadCsv(rows: LogRow[]) {
  const lines = ["date,machine_id,name,days", ...rows.map((r) => `${r.date},${r.machineId},${r.name},${r.days}`)];
  const blob = new Blob(["﻿" + lines.join("\n") + "\n"], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "issued_keys.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export default function BotKeyGenerator() {
  // The password stays in this page's memory only; reloading the page forgets it.
  const [password, setPassword] = useState("");
  const [machineId, setMachineId] = useState("");
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Issued | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<LogRow[]>([]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("busy");
    setError("");
    setCopied(false);

    try {
      const res = await fetch("/api/botgeneratekey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, machineId, name, days }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(null);
        setError(data.message ?? "ออกคีย์ไม่สำเร็จ");
      } else {
        setResult(data);
        setHistory((h) => [data.row, ...h]);
      }
    } catch {
      setResult(null);
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setStatus("idle");
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("คัดลอกไม่สำเร็จ กรุณาเลือกข้อความคีย์แล้วคัดลอกเอง");
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-field bg-primary/10 px-2 py-1 text-xs font-bold tracking-widest text-primary">
            <KeyRound aria-hidden="true" className="h-3.5 w-3.5" />
            BOT LICENSE
          </p>
          <h1 className="text-2xl font-bold text-base-content sm:text-3xl">ตัวออกคีย์ Bot</h1>
          <p className="mt-1 text-sm text-base-content/70">
            วางรหัสเครื่องที่ผู้ใช้ส่งมา แล้วกดสร้างคีย์ ส่งคีย์ที่ได้กลับให้ผู้ใช้
          </p>
        </header>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-box border border-base-300 bg-base-100 p-4 sm:p-6"
        >
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <Lock aria-hidden="true" className="h-4 w-4" />
              รหัสผ่านผู้ดูแล
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
              className="input input-bordered min-h-11 w-full"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold">รหัสเครื่อง</span>
            <input
              value={machineId}
              onChange={(e) => setMachineId(e.target.value.toUpperCase())}
              placeholder="A1B2C-3D4E5-F6A7B-8C9D0"
              autoComplete="off"
              spellCheck={false}
              required
              className="input input-bordered min-h-11 w-full font-mono"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">
                ชื่อผู้ใช้ <span className="font-normal text-base-content/60">(ไว้จดจำ ไม่ใส่ก็ได้)</span>
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                autoComplete="off"
                className="input input-bordered min-h-11 w-full"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">
                จำนวนวันก่อนหมดอายุ <span className="font-normal text-base-content/60">(ว่าง = ถาวร)</span>
              </span>
              <input
                value={days}
                onChange={(e) => setDays(e.target.value)}
                inputMode="decimal"
                autoComplete="off"
                className="input input-bordered min-h-11 w-full"
              />
            </label>
          </div>

          {error && (
            <div role="alert" className="alert alert-error text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "busy"}
            className="btn btn-primary min-h-11 w-full gap-2"
          >
            {status === "busy" ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound aria-hidden="true" className="h-4 w-4" />
            )}
            {status === "busy" ? "กำลังสร้างคีย์..." : "สร้างคีย์"}
          </button>
        </form>

        {result && (
          <section
            aria-label="คีย์ที่สร้าง"
            className="space-y-3 rounded-box border border-success/50 bg-base-100 p-4 sm:p-6"
          >
            <p className="text-sm text-base-content/70">
              ออกให้เครื่อง <span className="font-mono font-semibold">{result.row.machineId}</span>
              {result.row.name && ` (${result.row.name})`} ·{" "}
              {result.expiresAt ? `หมดอายุ ${thaiDate(result.expiresAt)}` : "ใช้ได้ถาวร"}
            </p>
            <textarea
              readOnly
              value={result.key}
              rows={5}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="คีย์"
              className="textarea textarea-bordered w-full break-all font-mono text-xs"
            />
            <button type="button" onClick={copy} className="btn btn-outline min-h-11 gap-2">
              {copied ? (
                <Check aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Copy aria-hidden="true" className="h-4 w-4" />
              )}
              {copied ? "คัดลอกแล้ว" : "คัดลอกคีย์"}
            </button>
          </section>
        )}

        {history.length > 0 && (
          <section aria-label="ประวัติการออกคีย์" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">ที่ออกในหน้านี้ ({history.length})</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => downloadCsv([...history].reverse())}
                  className="btn btn-outline btn-sm min-h-11 gap-2"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  ดาวน์โหลด CSV
                </button>
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="btn btn-ghost btn-sm min-h-11 gap-2"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                  ล้างรายการ
                </button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>วันที่</th>
                    <th>รหัสเครื่อง</th>
                    <th>ชื่อ</th>
                    <th>อายุ (วัน)</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r, i) => (
                    <tr key={`${r.date}-${r.machineId}-${i}`}>
                      <td className="whitespace-nowrap">{r.date}</td>
                      <td className="font-mono">{r.machineId}</td>
                      <td>{r.name}</td>
                      <td>{r.days === "permanent" ? "ถาวร" : r.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-base-content/60">
              รายการนี้อยู่ในหน้านี้เท่านั้น ปิดหรือรีเฟรชแล้วหาย โหลด CSV เก็บไว้ก่อนปิดหน้า
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
