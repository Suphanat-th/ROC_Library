export default function StatusServerPage() {
  // เวลาปัจจุบันแบบไทย (ไม่แปลงเป็นสตริง)
  const current = new Date(Date.now() + 7 * 60 * 60 * 1000); // GMT+7

  // ดึงวันที่วันนี้ (ตาม timezone ไทย)
  const y = current.getUTCFullYear();
  const m = current.getUTCMonth();
  const d = current.getUTCDate();

  // ช่วงปิดเซิร์ฟ 06:00 - 12:00
  const start = new Date(Date.UTC(y, m, d, 6, 0, 0));
  const end = new Date(Date.UTC(y, m, d, 12, 0, 0));

  // ถ้าอยู่ในช่วง 06:00–12:00 = ปิดเซิร์ฟ
  const serverOn = !(current >= start && current <= end);

  const textServer = serverOn ? "Server On" : "Server Off";
  const color = serverOn ? "green" : "rose";
  
  
   return (
    <div className="col-span-1">
      <div className="p-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative">

            <div className={`absolute inset-0 rounded-full border-2 border-${color}-400/90 animate-ping`}></div>
            <div className={`absolute inset-0 rounded-full border border-${color}-400/80 animate-pulse delay-500`}></div>

            <div className={`p-6 rounded-full backdrop-blur-lg border border-${color}-500/50 bg-linear-to-br from-${color}-500/80 to-${color}-800/60 shadow-2xl transition-all duration-500`}>
              <div>{textServer}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
