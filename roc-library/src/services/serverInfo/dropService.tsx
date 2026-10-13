import { RateSource } from "@/types/serverInfo";

// Hand-maintained. Write times as ISO strings with +07:00 (Thailand time).
export function dropService(): RateSource {
  return {
    base: {
      name: "Base",
      ratePercent: 100,
      DateFrom: null,
      DateTo: null,
      description: "Base drop rate applied to the server",
    },
    events: [
      {
        name: "Drop 25%",
        ratePercent: 25,
        DateFrom: new Date("2026-05-29T12:00:00+07:00"),
        DateTo: new Date("2026-06-04T06:00:00+07:00"),
        description: "Drop Up หยุดยาวนี้พรี่มีคูณ 25%",
      },
    ],
  };
}
