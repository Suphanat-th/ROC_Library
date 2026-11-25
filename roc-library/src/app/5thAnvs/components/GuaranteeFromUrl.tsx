"use client";

import { useEffect, useState } from "react";
import type { GuaranteeServer } from "@/data/anniversary5thGuarantee";
import GuaranteeBrowser from "./GuaranteeBrowser";

/** Opens the Guarantee browser on the server and version named in the link (?server=moonlight&v=2). */
export default function GuaranteeFromUrl() {
  const [start, setStart] = useState<{ server: GuaranteeServer; version: number } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStart({
      server: params.get("server") === "moonlight" ? "moonlight" : "baphomet",
      version: Number(params.get("v")) || 1,
    });
  }, []);

  // The browser keeps its own state after the first render, so it waits until the link has been read.
  if (!start) return <div className="min-h-[60vh]" aria-busy="true" />;
  return <GuaranteeBrowser initialServer={start.server} initialVersion={start.version} />;
}
