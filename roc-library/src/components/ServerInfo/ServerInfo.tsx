import ExpServerPage from "./Exp";
import StatusServerPage from "./Status";

export default function ServerInfo() {
  return (
    <div className="flex w-full justify-center">
      <section
        aria-labelledby="server-info-heading"
        className="w-full max-w-xl rounded-box border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="server-info-heading"
            className="text-lg font-semibold text-base-content"
          >
            Server Info{" "}
            <span className="font-normal text-base-content/60">
              (Baphomet, Moonlight)
            </span>
          </h2>
          <StatusServerPage />
        </div>

        <ExpServerPage />
      </section>
    </div>
  );
}
