"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkMember } from "@/utils/memberAuth";
import CostumeSimulator from "./CostumeSimulator";

type Gate = "checking" | "open" | "closed";

const SIGN_IN = "/member/login?next=/costume";

const isLocalhost = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

/**
 * Opens the Costume simulator for a signed-in Member (and always on localhost). For now it is for Members only;
 * when it opens to everyone, replace this gate with the simulator itself. A Key does not open it.
 */
export default function CostumeGate() {
  const router = useRouter();
  const [gate, setGate] = useState<Gate>("checking");

  useEffect(() => {
    let cancelled = false;
    const decide = (next: Gate) => {
      if (!cancelled) setGate(next);
    };

    if (isLocalhost()) {
      decide("open");
      return;
    }

    checkMember()
      .then((member) => {
        if (member === "signed-in") return decide("open");
        if (member === "expired") return router.replace(`${SIGN_IN}&expired=1`);
        decide("closed");
      })
      .catch(() => decide("closed"));

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (gate === "checking") return <div className="min-h-[50vh]" aria-busy="true" />;
  if (gate === "open") return <CostumeSimulator />;

  return (
    <main className="flex min-h-[50vh] items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Simulator Costume ROC</h1>
        <p className="mt-2 text-base-content/70">หน้านี้เปิดให้เฉพาะ Member ในตอนนี้</p>
        <p className="mt-4 text-sm">
          <Link href={SIGN_IN} className="link">
            Member เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </main>
  );
}
