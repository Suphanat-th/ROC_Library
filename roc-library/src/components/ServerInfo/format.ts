const TZ = "Asia/Bangkok";

/** "29 พ.ค. 12:00 น." in Thailand time. */
export const formatThaiDateTime = (date: Date) =>
  `${date.toLocaleString("th-TH", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })} น.`;

/** "พุธ 6 พ.ย." in Thailand time. */
export const formatThaiDay = (date: Date) =>
  date.toLocaleDateString("th-TH", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "short",
  });

/** "06:00" in Thailand time. */
export const formatThaiClock = (date: Date) =>
  date.toLocaleTimeString("th-TH", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

/** "3 วัน 4 ชม." / "2 ชม. 5 นาที" / "ไม่ถึง 1 นาที". */
export function formatDuration(ms: number) {
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days} วัน ${hours} ชม.`;
  if (hours > 0) return `${hours} ชม. ${minutes} นาที`;
  if (minutes > 0) return `${minutes} นาที`;
  return "ไม่ถึง 1 นาที";
}
