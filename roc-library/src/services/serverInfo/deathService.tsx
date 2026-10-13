import { RateSource } from "@/types/serverInfo";

// Hand-maintained. Write times as ISO strings with +07:00 (Thailand time).
// ratePercent is a change to the death penalty: -100 removes all of it.
export function deathService(): RateSource {
  return {
    base: {
      name: "Base",
      ratePercent: 100,
      DateFrom: null,
      DateTo: null,
      description: "Base death penalty rate applied to the server",
    },
    events: [
      {
        name: "Sun Moon 100%",
        ratePercent: -100,
        DateFrom: new Date("2026-05-06T06:00:00+07:00"),
        DateTo: new Date("2026-05-27T06:00:00+07:00"),
        description: "Sun Moon Event ลด Death Penalty 100%",
      },
    ],
  };
}
