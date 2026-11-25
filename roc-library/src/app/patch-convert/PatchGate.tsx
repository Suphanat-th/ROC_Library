"use client";

import { useEffect, useState } from "react";
import PatchConvertClient from "./PatchConvertClient";

type Gate = "checking" | "open" | "closed";

const REMEMBER = "roc-patch-key-ok";

const isLocalhost = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

/**
 * Opens Patch convert only for a link with a valid ?Key=. The Keys stay on the server (/api/patch-key);
 * this page only learns "ok". A Key that was accepted is remembered for the tab, so reloading does not ask again.
 */
export default function PatchGate() {
  const [gate, setGate] = useState<Gate>("checking");

  useEffect(() => {
    let cancelled = false;
    const decide = (next: Gate) => {
      if (!cancelled) setGate(next);
    };

    const key = new URLSearchParams(window.location.search).get("Key");
    if (isLocalhost()) return decide("open");
    if (!key) return decide("closed");

    try {
      if (sessionStorage.getItem(REMEMBER) === key) return decide("open");
    } catch {
      // Storage can be blocked; ask the server every time then.
    }

    fetch("/api/patch-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok) {
          try {
            sessionStorage.setItem(REMEMBER, key);
          } catch {
            // Remembering is optional.
          }
          decide("open");
        } else {
          decide("closed");
        }
      })
      .catch(() => decide("closed"));

    return () => {
      cancelled = true;
    };
  }, []);

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
      </div>
    </main>
  );
}
