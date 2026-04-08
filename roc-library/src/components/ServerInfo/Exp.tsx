import { deathService } from "@/services/serverInfo/deathService";
import { dropService } from "@/services/serverInfo/dropService";
import { expService } from "@/services/serverInfo/expService";

export default function ExpServerPage() {


  const exp = expService();
  const drop = dropService();
  const death = deathService();

  return (
    <ul className="w-full flex flex-col gap-2 col-span-1">
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <div className="group relative w-full">
          <button className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-purple-800 transition-all active:scale-95">
            <div className="rounded-lg border-2 border-purple-300 bg-purple-100 p-1">EXP</div>
            <div className="font-semibold">{exp.reduce((acc, curr) => acc + curr.ratePercent, 0)}%</div>
          </button>
          <div className="pointer-events-none invisible group-hover:visible group-hover:pointer-events-auto absolute left-full ml-3 top-0 z-50 w-72 text-sm shadow-lg whitespace-pre-line">
            <fieldset className="rounded-md p-0 overflow-hidden" style={{ backgroundColor: 'rgba(237, 233, 254, 1)', color: '#5b21b6', border: '1px solid rgba(219, 234, 254, 1)' }}>
              <legend className="px-3 text-sm font-semibold" style={{ color: '#4c1d95' }}>EXP details</legend>
              <div className="p-3">
                {exp.map((e, i) => (
                  <fieldset key={i} className="mb-2 rounded-sm border p-2 bg-white last:mb-0">
                    <legend className="px-1 text-sm font-medium">{e.name}</legend>
                    <div className="text-sm text-gray-700">{e.description ?? "No description"}</div>
                  </fieldset>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </li>
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <div className="group relative w-full">
          <button className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-blue-800 transition-all active:scale-95">
            <div className="rounded-lg border-2 border-blue-300 bg-blue-100 p-1">DROP</div>
            <div className="font-semibold">{drop.reduce((acc, curr) => acc + curr.ratePercent, 0)}%</div>
          </button>
          <div className="pointer-events-none invisible group-hover:visible group-hover:pointer-events-auto absolute left-full ml-3 top-0 z-50 w-72 text-sm shadow-lg whitespace-pre-line">
            <fieldset className="rounded-md p-0 overflow-hidden" style={{ backgroundColor: 'rgba(224, 242, 254, 1)', color: '#1e3a8a', border: '1px solid rgba(219, 234, 254, 1)' }}>
              <legend className="px-3 text-sm font-semibold" style={{ color: '#1e40af' }}>DROP details</legend>
              <div className="p-3">
                {drop.map((d, i) => (
                  <fieldset key={i} className="mb-2 rounded-sm border p-2 bg-white last:mb-0">
                    <legend className="px-1 text-sm font-medium">{d.name}</legend>
                    <div className="text-sm text-gray-700">{d.description ?? "No description"}</div>
                  </fieldset>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </li>
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <div className="group relative w-full">
          <button className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-red-800 transition-all active:scale-95">
            <div className="rounded-lg border-2 border-red-300 bg-red-100 p-1">DEATH</div>
            <div className="font-semibold">{death.reduce((acc, curr) => acc + curr.ratePercent, 0)}%</div>
          </button>
          <div className="pointer-events-none invisible group-hover:visible group-hover:pointer-events-auto absolute left-full ml-3 top-0 z-50 w-72 text-sm shadow-lg whitespace-pre-line">
            <fieldset className="rounded-md p-0 overflow-hidden" style={{ backgroundColor: 'rgba(254, 226, 226, 1)', color: '#991b1b', border: '1px solid rgba(254, 226, 226, 1)' }}>
              <legend className="px-3 text-sm font-semibold" style={{ color: '#7f1d1d' }}>DEATH details</legend>
              <div className="p-3">
                {death.map((d, i) => (
                  <fieldset key={i} className="mb-2 rounded-sm border p-2 bg-white last:mb-0">
                    <legend className="px-1 text-sm font-medium">{d.name}</legend>
                    <div className="text-sm text-gray-700">{d.description ?? "No description"}</div>
                  </fieldset>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </li>
    </ul>
  );
}
