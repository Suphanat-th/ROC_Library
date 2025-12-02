import ExpServerPage from "./Exp";
import StatusServerPage from "./Status";

export default function ServerInfo() {
  return (
    <div className="flex justify-center w-full mt-6">
      <div
        className="
          bg-white/30
          backdrop-blur-md
          shadow-xl
          shadow-purple-500/30
          border border-white/40
          rounded-2xl 
          p-8
          w-[420px]
          grid grid-cols-2 gap-5
        "
      >
        <span className="text-xl text-pink-600 underline font-semibold col-span-2 text-center">
          Server Info (Baphomet)
        </span>

        {/* Your components */}
        <ExpServerPage />
        <StatusServerPage />
      </div>
    </div>
  );
}
