import { deathService } from "@/services/serverInfo/deathService";
import { dropService } from "@/services/serverInfo/dropService";
import { expService } from "@/services/serverInfo/expService";

export default function ExpServerPage() {


  const exp = expService();
  const drop = dropService();
  const death = deathService();
  console.log(exp);
  console.log(drop);
  console.log(death);
  const expTip = exp
    .map((e) => `${e.name}${e.description ? `: ${e.description}` : ""}`)
    .join(" \n");
  const dropTip = drop
    .map((e) => `${e.name}${e.description ? `: ${e.description}` : ""}`)
    .join(" \n");
  const deathTip = death
    .map((e) => `${e.name}${e.description ? `: ${e.description}` : ""}`)
    .join(" \n");
  return (
    <ul className="w-full flex flex-col gap-2 col-span-1">
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <div className="group relative w-full">
          <button className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-purple-800 transition-all active:scale-95">
            <div className="rounded-lg border-2 border-purple-300 bg-purple-100 p-1">EXP</div>
            <div className="font-semibold">{exp.reduce((acc, curr) => acc + curr.ratePercent, 0)}%</div>
          </button>
          <div className="pointer-events-none invisible group-hover:visible group-hover:pointer-events-auto absolute left-full ml-3 top-0 z-50 w-72 rounded-md p-3 text-sm shadow-lg whitespace-pre-line"
               style={{ backgroundColor: 'rgba(237, 233, 254, 1)', color: '#5b21b6' }}>
            <div className="font-semibold mb-1">EXP details</div>
            {exp.map((e, i) => (
              <div key={i} className="mb-1">
                <div className="font-medium">{e.name}</div>
                <div className="text-gray-600">{e.description ?? "No description"}</div>
              </div>
            ))}
          </div>
        </div>
      </li>
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <div className="group relative w-full">
          <button className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-blue-800 transition-all active:scale-95">
            <div className="rounded-lg border-2 border-blue-300 bg-blue-100 p-1">DROP</div>
            <div className="font-semibold">{drop.reduce((acc, curr) => acc + curr.ratePercent, 0)}%</div>
          </button>
          <div className="pointer-events-none invisible group-hover:visible group-hover:pointer-events-auto absolute left-full ml-3 top-0 z-50 w-72 rounded-md p-3 text-sm shadow-lg whitespace-pre-line"
               style={{ backgroundColor: 'rgba(224, 242, 254, 1)', color: '#1e3a8a' }}>
            <div className="font-semibold mb-1">DROP details</div>
            {drop.map((d, i) => (
              <div key={i} className="mb-1">
                <div className="font-medium">{d.name}</div>
                <div className="text-gray-600">{d.description ?? "No description"}</div>
              </div>
            ))}
          </div>
        </div>
      </li>
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <div className="group relative w-full">
          <button className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-red-800 transition-all active:scale-95">
            <div className="rounded-lg border-2 border-red-300 bg-red-100 p-1">DEATH</div>
            <div className="font-semibold">{death.reduce((acc, curr) => acc + curr.ratePercent, 0)}%</div>
          </button>
          <div className="pointer-events-none invisible group-hover:visible group-hover:pointer-events-auto absolute left-full ml-3 top-0 z-50 w-72 rounded-md p-3 text-sm shadow-lg whitespace-pre-line"
               style={{ backgroundColor: 'rgba(254, 226, 226, 1)', color: '#991b1b' }}>
            <div className="font-semibold mb-1">DEATH details</div>
            {death.map((d, i) => (
              <div key={i} className="mb-1">
                <div className="font-medium">{d.name}</div>
                <div className="text-gray-600">{d.description ?? "No description"}</div>
              </div>
            ))}
          </div>
        </div>
      </li>
    </ul>
  );
}
