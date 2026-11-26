"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface MemberRow {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
  suspended: boolean;
}

type Command = "list" | "invite" | "suspend" | "unsuspend" | "remove";

/**
 * The owner's page for Members: invite by email, see the list, suspend or remove. The password is kept
 * only in this page's memory and sent with every command; the Worker checks it each time.
 */
export default function MemberAdmin() {
  const [password, setPassword] = useState("");
  const [members, setMembers] = useState<MemberRow[] | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  /** Sends one command with the password. Returns the answer, or null after showing the problem. */
  async function send(action: Command, extra: Record<string, string> = {}) {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, password, ...extra }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) setMembers(null);
        setError(data.message ?? "ทำรายการไม่สำเร็จ");
        return null;
      }
      return data;
    } catch {
      setError("เชื่อมต่อไม่ได้ กรุณาลองอีกครั้ง");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function load() {
    const data = await send("list");
    if (data) setMembers(data.members);
  }

  // Shown only after something is typed, so an empty box is not scolded.
  const inviteProblem = email.trim() !== "" && !EMAIL_SHAPE.test(email.trim()) ? "รูปแบบอีเมลไม่ถูกต้อง เช่น name@example.com" : null;

  async function invite(event: React.FormEvent) {
    event.preventDefault();
    if (inviteProblem || email.trim() === "") return;
    const data = await send("invite", { email });
    if (!data) return;
    setMessage(`ส่งคำเชิญไปที่ ${email.trim()} แล้ว`);
    setEmail("");
    await load();
  }

  async function act(action: "suspend" | "unsuspend" | "remove", row: MemberRow) {
    if (action === "remove" && !window.confirm(`ลบ ${row.username ?? row.email} ออกจาก Member?`)) return;
    if (await send(action, { id: row.id })) await load();
  }

  if (!members) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-sm items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load();
          }}
          className="card w-full border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="card-body gap-4">
            <h1 className="text-xl font-bold">แอดมิน Member</h1>
            <input
              className="input input-bordered w-full"
              type="password"
              placeholder="รหัสผ่านแอดมิน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && (
              <p role="alert" className="text-sm text-error">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? <span className="loading loading-spinner loading-sm" /> : "เข้าสู่ระบบ"}
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">แอดมิน Member</h1>

      <section className="card border border-base-300 bg-base-100">
        <form onSubmit={invite} className="card-body gap-3" noValidate>
          <div>
            <h2 className="card-title text-base">เชิญ Member ใหม่</h2>
            <p className="text-sm text-base-content/70">
              ระบบส่งลิงก์ไปที่อีเมลนี้ ผู้รับกดลิงก์แล้วตั้ง username กับรหัสผ่านเอง
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label
              className={`input input-bordered flex w-full items-center gap-2 ${
                inviteProblem ? "input-error" : ""
              }`}
            >
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-base-content/50" />
              <input
                type="email"
                inputMode="email"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="player@example.com"
                aria-label="อีเมลของ Member ที่จะเชิญ"
                aria-invalid={Boolean(inviteProblem)}
                aria-describedby="invite-hint"
                className="grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary shrink-0 gap-2"
              disabled={busy || email.trim() === ""}
            >
              {busy ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Send aria-hidden="true" className="h-4 w-4" />
              )}
              ส่งคำเชิญ
            </button>
          </div>

          <p id="invite-hint" role={inviteProblem ? "alert" : undefined} className={`text-sm ${inviteProblem ? "text-error" : "text-base-content/60"}`}>
            {inviteProblem ?? "ตรวจตัวสะกดให้ถูกก่อนส่ง คำเชิญหนึ่งฉบับใช้โควตาอีเมลของ Resend หนึ่งฉบับ"}
          </p>
        </form>
      </section>

      <div aria-live="polite">
        {message && (
          <p role="status" className="text-sm text-success">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>อีเมล</th>
              <th>เข้าร่วม</th>
              <th className="text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-base-content/60">
                  ยังไม่มี Member
                </td>
              </tr>
            )}
            {members.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.username ?? <span className="text-base-content/50">รอตั้งค่า</span>}
                  {row.suspended && <span className="badge badge-warning badge-sm ml-2">ระงับ</span>}
                </td>
                <td className="break-all">{row.email}</td>
                <td className="whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString("th-TH")}</td>
                <td className="whitespace-nowrap text-right">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    disabled={busy}
                    onClick={() => act(row.suspended ? "unsuspend" : "suspend", row)}
                  >
                    {row.suspended ? "เลิกระงับ" : "ระงับ"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-error"
                    disabled={busy}
                    onClick={() => act("remove", row)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
