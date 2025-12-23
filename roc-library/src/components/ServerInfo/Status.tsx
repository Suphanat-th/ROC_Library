export default function StatusServerPage() {
  const current = new Date();
  const start = new Date(2025, 11, 24, 6, 0, 0);
  const end = new Date(2025, 11, 24, 12, 0, 0);

  const serverOn = !(current >= start && current <= end);

  return (
    <div className="col-span-1">
      <div className="p-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {serverOn ? <ServerOnTemplate /> : <ServerOffTemplate />}
        </div>
      </div>
    </div>
  );
}

function ServerOnTemplate() {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full border-2 border-green-400/90 animate-ping"></div>
      <div className="absolute inset-0 rounded-full border border-green-400/80 animate-pulse delay-500"></div>

      <div className="p-6 rounded-full backdrop-blur-lg border border-green-500/50 bg-gradient-to-br from-green-500/80 to-green-800/60 shadow-2xl">
        Server On
      </div>
    </div>
  );
}

function ServerOffTemplate() {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full border-2 border-rose-400/90 animate-ping"></div>
      <div className="absolute inset-0 rounded-full border border-rose-400/80 animate-pulse delay-500"></div>

      <div className="p-6 rounded-full backdrop-blur-lg border border-rose-500/50 bg-gradient-to-br from-rose-500/80 to-rose-800/60 shadow-2xl">
        Server Off
      </div>
    </div>
  );
}
