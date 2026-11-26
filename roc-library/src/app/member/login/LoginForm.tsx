"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { checkMember, markSeen, memberAuthConfigured, memberClient } from "@/utils/memberAuth";
import { normalizeUsername, safeNextPath } from "@/utils/memberRules";

/**
 * Member sign-in. The Worker finds the email behind the username and signs in; the browser then keeps the
 * session with Supabase. After signing in the Member goes home, or back to where they were sent from
 * (?next=, used when a session expired on Patch Convert).
 */
export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const expired = params.get("expired") === "1";

  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // A Member who is already signed in has no use for this form.
  useEffect(() => {
    let cancelled = false;
    checkMember().then((state) => {
      if (cancelled) return;
      if (state === "signed-in") router.replace("/");
      else setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username: normalizeUsername(username), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.access_token) {
        setError(data.message ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
        return;
      }
      const supabase = memberClient();
      const { error: sessionError } = supabase
        ? await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token })
        : { error: new Error("not configured") };
      if (sessionError) {
        setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
        return;
      }
      markSeen();
      router.replace(next);
    } catch {
      setError("เชื่อมต่อไม่ได้ กรุณาลองอีกครั้ง");
    } finally {
      setBusy(false);
    }
  }

  if (!memberAuthConfigured()) {
    return <p className="text-error">ระบบ Member ยังไม่ได้ตั้งค่า</p>;
  }
  if (checking) {
    return <div className="flex justify-center py-6" aria-busy="true"><span className="loading loading-spinner" /></div>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">เข้าสู่ระบบ Member</h1>
        <p className="mt-1 text-sm text-base-content/70">สำหรับ Member ที่ได้รับเชิญเท่านั้น</p>
      </div>

      {expired && (
        <div role="alert" className="alert alert-warning text-sm">
          Session หมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง
        </div>
      )}

      <label className="form-control">
        <span className="mb-1 block text-sm">Username</span>
        <input
          className="input input-bordered w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm">รหัสผ่าน</span>
        <input
          className="input input-bordered w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? <span className="loading loading-spinner loading-sm" /> : "เข้าสู่ระบบ"}
      </button>

      <Link href="/member/forgot" className="link text-center text-sm">
        ลืมรหัสผ่าน
      </Link>
    </form>
  );
}
