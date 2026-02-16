import { JobClass, StoneClasses } from "@/types/StoneClassses";
import StoneEffect from "./stoneEffect";

type Props = StoneClasses;
export default function JobStoneCard({
  name,
  image,
  description,
  stone,
  position,
  version,
}: Props) {
  console.log(stone);
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow hover:scale-105 transition">
      <div className="mt-3 text-4xl font-bold text-center text-yellow-400 w-full">
        <img src={image} alt={name} className="w-8 h-8 object-contain inline" />{" "}
        {name}
      </div>

      <p className="text-sm text-gray-300 text-center mt-1">{}</p>

      <div className="mt-4 text-center">
        <div className="text-xs px-3 py-1 rounded-lg grid grid-cols-8 gap-3">
          {stone.map((f, index) => {
            const isGarment = f.position === "garment";
            const isUpper = f.position === "upper";
            const isMiddle = f.position === "middle";
            const isLower = f.position === "lower";

            return (
              <div
                key={f.name}
                className={`col-span-4 text-black ${isGarment ? "row-span-3" : ""}`}
              >
                <div className="card bg-base-100 shadow-lg border border-base-300 h-full">
                  <div className="card-body space-y-4">
                    {/* Header: รูป + ชื่อ */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded bg-base-200 p-2">
                          <img
                            src={f.image}
                            alt={f.name}
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <div className="text-left">
                        <h2 className="text-2xl font-bold">
                          {f.name} {/* แสดง Badge ตามตำแหน่ง */}
                          <span
                            className={`badge badge-xs ${
                              isGarment
                                ? "badge-success"
                                : isUpper
                                  ? "badge-primary"
                                  : isMiddle
                                    ? "badge-accent"
                                    : isLower
                                      ? "badge-error"
                                      : ""
                            }`}
                          >
                            {f.position}
                          </span>
                        </h2>
                      </div>
                    </div>

                    {/* Description */}
                    <StoneEffect
                      key={index}
                      effect={f.description}
                      position={f.position}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
