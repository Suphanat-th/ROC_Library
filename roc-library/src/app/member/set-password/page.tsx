"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markSeen, memberAuthConfigured, memberClient } from "@/utils/memberAuth";
import { normalizeUsername, passwordProblem, usernameProblem } from "@/utils/memberRules";

type Stage = "checking" | "no-link" | "form";

/**
 * Where the emailed links land: finishing an Invite (choose a username and a password) and resetting a
 * forgotten password (choose a password). Supabase signs the visitor in from the link's address; the form
 * asks for a username only when this Member has none yet.
 */
export default function SetPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("checking");
  const [needsUsername, setNeedsUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Why the link was refused. Shown only in development, to find what is wrong with a link that should work.
  const [why, setWhy] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = memberClient();
      if (!supabase) return;
      // Reading the session waits for Supabase to finish reading the tokens in the link's address.
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (cancelled) return;
      let session = data.session;
      if (!session) {
        // Supabase did not pick the tokens up by itself; read them from the address and set the session
        // directly, which also tells us exactly why a link is refused (wrong key, expired token...).
        const fromLink = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = fromLink.get("access_token");
        const refreshToken = fromLink.get("refresh_token");
        if (accessToken && refreshToken) {
          const { data: set, error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (cancelled) return;
          session = set.session;
          if (setError) setWhy(`ตั้ง session จากลิงก์ไม่สำเร็จ: ${setError.message}`);
          else window.history.replaceState(null, "", window.location.pathname);
        } else {
          setWhy(`ไม่มี token ใน URL${sessionError ? `: ${sessionError.message}` : ""}`);
        }
      }
      if (!session) return setStage("no-link");
      const res = await fetch("/api/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claim", token: session.access_token }),
      }).catch((e: unknown) => {
        setWhy(`เรียก /api/member ไม่ได้: ${e instanceof Error ? e.message : String(e)}`);
        return null;
      });
      if (cancelled) return;
      const info = await res?.json().catch(() => null);
      if (!res || !res.ok || !info) {
        if (res) setWhy(`/api/member ตอบ ${res.status}: ${info?.message ?? "ไม่มีข้อความ"}`);
        return setStage("no-link");
      }
      setNeedsUsername(info.username === null);
      setStage("form");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = memberClient();
    if (!supabase || busy) return;
    setError("");

    const name = normalizeUsername(username);
    const problem = (needsUsername ? usernameProblem(name) : null) ?? passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== again) return setError("รหัสผ่านสองช่องไม่ตรงกัน");

    setBusy(true);
    try {
      if (needsUsername) {
        const { data } = await supabase.auth.getSession();
        const res = await fetch("/api/member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "claim", token: data.session?.access_token, username: name }),
        });
        const info = await res.json().catch(() => ({}));
        if (!res.ok) return setError(info.message ?? "บันทึก username ไม่สำเร็จ");
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) return setError("ตั้งรหัสผ่านไม่สำเร็จ: " + updateError.message);
      // The profile now carries the username; fetch it so the Navbar can show it right away.
      await supabase.auth.refreshSession();
      markSeen();
      router.replace("/");
    } catch {
      setError("เชื่อมต่อไม่ได้ กรุณาลองอีกครั้ง");
    } finally {
      setBusy(false);
    }
  }

  if (!memberAuthConfigured()) return <p className="text-error">ระบบ Member ยังไม่ได้ตั้งค่า</p>;
  if (stage === "checking") {
    return <div className="flex justify-center py-6" aria-busy="true"><span className="loading loading-spinner" /></div>;
  }
  if (stage === "no-link") {
    return (
      <>
        <h1 className="text-2xl font-bold">ลิงก์ใช้ไม่ได้</h1>
        <p className="text-sm text-base-content/70">ลิงก์อาจหมดอายุหรือถูกใช้ไปแล้ว ขอลิงก์ใหม่ได้ที่หน้าลืมรหัสผ่าน</p>
        {process.env.NODE_ENV !== "production" && why && (
          <p className="break-all rounded-box bg-base-200 p-2 font-mono text-xs text-base-content/70">dev: {why}</p>
        )}
        <Link href="/member/forgot" className="btn btn-primary">
          ขอลิงก์ใหม่
        </Link>
      </>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">{needsUsername ? "ตั้งค่าบัญชี Member" : "ตั้งรหัสผ่านใหม่"}</h1>
        {needsUsername && (
          <p className="mt-1 text-sm text-base-content/70">
            เลือก username (a-z, 0-9, _ ยาว 3-20 ตัว) เปลี่ยนภายหลังไม่ได้
          </p>
        )}
      </div>

      {needsUsername && (
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
      )}

      <label className="form-control">
        <span className="mb-1 block text-sm">รหัสผ่านใหม่ (อย่างน้อย 8 ตัว)</span>
        <input
          className="input input-bordered w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm">ยืนยันรหัสผ่าน</span>
        <input
          className="input input-bordered w-full"
          type="password"
          value={again}
          onChange={(e) => setAgain(e.target.value)}
          autoComplete="new-password"
          required
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? <span className="loading loading-spinner loading-sm" /> : "บันทึก"}
      </button>
    </form>
  );
}
