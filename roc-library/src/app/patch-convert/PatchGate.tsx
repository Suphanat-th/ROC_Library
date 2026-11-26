"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkMember } from "@/utils/memberAuth";
import PatchConvertClient from "./PatchConvertClient";

type Gate = "checking" | "open" | "closed";

const REMEMBER = "roc-patch-key-ok";

const isLocalhost = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

const SIGN_IN = "/member/login?next=/patch-convert";

/**
 * Opens Patch convert for a signed-in Member, or for a link with a valid ?Key=. The Keys stay on the server
 * (/api/patch-key); this page only learns "ok". A Key that was accepted is remembered for the tab, so reloading
 * does not ask again. A Member whose session ran out is sent to sign in again and comes back here.
 */
export default function PatchGate() {
  const router = useRouter();
  const [gate, setGate] = useState<Gate>("checking");

  useEffect(() => {
    let cancelled = false;
    const decide = (next: Gate) => {
      if (!cancelled) setGate(next);
    };

    const key = new URLSearchParams(window.location.search).get("Key");
    if (isLocalhost()) return decide("open");

    const askKey = (sent: string) => {
      try {
        if (sessionStorage.getItem(REMEMBER) === sent) return decide("open");
      } catch {
        // Storage can be blocked; ask the server every time then.
      }

      fetch("/api/patch-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: sent }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.ok) {
            try {
              sessionStorage.setItem(REMEMBER, sent);
            } catch {
              // Remembering is optional.
            }
            decide("open");
          } else {
            decide("closed");
          }
        })
        .catch(() => decide("closed"));
    };

    checkMember()
      .then((member) => {
        if (member === "signed-in") return decide("open");
        if (key) return askKey(key);
        if (member === "expired") return router.replace(`${SIGN_IN}&expired=1`);
        decide("closed");
      })
      .catch(() => (key ? askKey(key) : decide("closed")));

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (gate === "checking") return <div className="min-h-[50vh]" aria-busy="true" />;
  if (gate === "open") return <PatchConvertClient />;

  return (
    <main className="flex min-h-[50vh] items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-error">Access denied</h1>
        <p className="mt-2 text-base-content/70">
          เปิดหน้านี้ด้วย parameter ที่ถูกต้อง
          <br />
          ติดตามข้อมูลเพิ่มเติมได้ที่
          <a
            href="https://www.facebook.com/profile.php?id=61579020425764"
            target="_blank"
            className="text-primary underline m-2"
          >
            FB: หมากัดหมวด
          </a>
          ประจำวันพุธ เวลา 06:00 เป็นต้นไป
        </p>
        <p className="mt-4 text-sm">
          <Link href={SIGN_IN} className="link">
            Member เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </main>
  );
}
