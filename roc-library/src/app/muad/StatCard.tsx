interface StatCardProps {
  label: string;
  value: string;
  progress: number;
  color: "progress-primary" | "progress-secondary" | "progress-accent" | "progress-info"; 
  // การกำหนดแบบนี้ช่วยให้พิมพ์ชื่อสีผิดแล้วมันจะฟ้องทันที (Auto-complete)
}

const StatCard = ({ label, value, progress, color }: StatCardProps) => (
  <div className="group hover:scale-105 transition-all duration-300">
    <div className="flex justify-between mb-1 text-sm font-bold uppercase tracking-wider">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <progress className={`progress ${color} w-full h-3 shadow-inner`} value={progress} max="100"></progress>
  </div>
)
export default StatCard;