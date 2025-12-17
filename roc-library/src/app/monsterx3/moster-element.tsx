import MonstersDb from "@/services/mosters/mostersDb";
import { Monster } from "@/types/monster";

const monsters: Monster[] = MonstersDb();

export default function Monsterx3ElementPage() {
  const monsterx3 = [1089, 1092, 1088, 1096, 1093, 1120, 1090];

  const monstersMiniBoss = monsters.filter((f) => monsterx3.includes(f.id));
  console.log(monstersMiniBoss)
  return (
    <div>
      {monstersMiniBoss.map((m) => (
        <div
          key={m.name}
          className="bg-gray-600 rounded-2xl p-4 w-[500px] shrink-0 shadow-lg shadow-gray-700 border border-gray-700 hover:border-cyan-400 transition grid grid-cols-2"
        >
          <div className="flex flex-col items-center col-span-1">
            <h2 className="text-2xl font-semibold text-cyan-300">
              {m.name} (#{m.id})
            </h2>
            <img
              src={m.image}
              alt={m.name}
              className="object-contain mb-3 h-[150px] w-[200px]"
            />
            <div className="text-xl mt-3 space-y-1">
              <p>
                <span className="text-gray-400">LV:</span> {m.lv}
              </p>
              <p>
                <span className="text-gray-400">HP:</span>{" "}
                {m.hp ? Number(m.hp).toLocaleString() : 0}
              </p>
              <p>
                <span className="text-gray-400">เผ่าพันธุ๋:</span> {m.race}
              </p>
              <p>
                <span className="text-gray-400">ธาตุ:</span> {m.property}
              </p>
              <p>
                <span className="text-gray-400">ขนาด:</span> {m.scale}
              </p>
              <p>
                <span className="text-gray-400">Def:</span> {m.def}
              </p>
              <p>
                <span className="text-gray-400">Mdef:</span> {m.mdef}
              </p>
            </div>
          </div>

          <div className=" col-span-1">
            <p>
              <span className="text-gray-400">ความเสียหายของมอนสเตอร์:</span>{" "}
              <main className="p-8"></main>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
