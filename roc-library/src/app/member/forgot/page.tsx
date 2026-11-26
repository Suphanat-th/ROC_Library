"use client";

import { useState } from "react";
import Link from "next/link";
import HumanCheck, { humanCheckEnabled } from "@/components/member/HumanCheck";
import { memberAuthConfigured } from "@/utils/memberAuth";

/** Asks the Worker (after the Human check) to email a link for choosing a new password. The answer is the same whether or not the address belongs to a Member. */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaRound, setCaptchaRound] = useState(0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot", email: email.trim(), captcha }),
      });
      if (res.ok) {
        setSent(true);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "ส่งลิงก์ไม่สำเร็จ กรุณาลองอีกครั้ง");
    } catch {
      setError("เชื่อมต่อไม่ได้ กรุณาลองอีกครั้ง");
    } finally {
      // The Human check token is good for one try only.
      setCaptcha("");
      setCaptchaRound((round) => round + 1);
      setBusy(false);
    }
  }

  if (!memberAuthConfigured()) return <p className="text-error">ระบบ Member ยังไม่ได้ตั้งค่า</p>;

  if (sent) {
    return (
      <>
        <h1 className="text-2xl font-bold">ตรวจอีเมลของคุณ</h1>
        <p className="text-sm text-base-content/70">
          ถ้าอีเมลนี้เป็นของ Member ระบบส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้แล้ว (ดูในกล่องสแปมด้วย)
        </p>
        <Link href="/member/login" className="btn btn-ghost">
          กลับไปเข้าสู่ระบบ
        </Link>
      </>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">ลืมรหัสผ่าน</h1>
        <p className="mt-1 text-sm text-base-content/70">กรอกอีเมลที่ได้รับคำเชิญ แล้วเราจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้</p>
      </div>

      <label className="form-control">
        <span className="mb-1 block text-sm">อีเมล</span>
        <input
          className="input input-bordered w-full"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <HumanCheck onToken={setCaptcha} resetKey={captchaRound} />

      <button type="submit" className="btn btn-primary" disabled={busy || (humanCheckEnabled && !captcha)}>
        {busy ? <span className="loading loading-spinner loading-sm" /> : "ส่งลิงก์"}
      </button>

      <Link href="/member/login" className="link text-center text-sm">
        กลับไปเข้าสู่ระบบ
      </Link>
    </form>
  );
}
