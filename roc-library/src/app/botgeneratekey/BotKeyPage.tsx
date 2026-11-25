"use client";

import { useCallback, useEffect, useState } from "react";
import BotKeyGenerator from "./BotKeyGenerator";

interface LogRow {
  date: string;
  machineId: string;
  name: string;
  days: string;
}

/** Asks the server whether this visitor is signed in (and for the Key record), then shows the tool. */
export default function BotKeyPage() {
  const [state, setState] = useState<{ signedIn: boolean; rows: LogRow[] | null } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/botgeneratekey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status" }),
      });
      const data = await res.json();
      setState({ signedIn: Boolean(data.signedIn), rows: data.rows ?? null });
    } catch {
      setState({ signedIn: false, rows: null });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  if (!state) return <div className="min-h-[60vh]" aria-busy="true" />;
  return <BotKeyGenerator signedIn={state.signedIn} rows={state.rows} refresh={load} />;
}
