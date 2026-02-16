import { DescriptionDetail } from "@/types/StoneClassses";

interface StoneEffectProps {
  effect: DescriptionDetail | null;
  position: "garment" | "upper" | "middle" | "lower" | string;
}

export default function StoneEffect({ effect, position }: StoneEffectProps) {
  console.log(effect, position);

  // ป้องกันกรณี effect เป็น null
  if (!effect) return null;

  switch (position) {
    case "garment":
      return (
        <div className="w-full">
          {/* แก้ไขส่วน .map() */}
          {effect.default?.map((f, index) => (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: f }}
              className="label underline font-bold w-full flex flex-wrap items-center gap-1 text-sm"
            />
          ))}
          <hr className="m-2" />

          <fieldset className="fieldset  bg-base-200 border-primary rounded-box  border p-4 my-3">
            <legend className="fieldset-legend text-primary">
              <span className="badge badge-primary">Upper</span>
            </legend>
            <div
              className="label underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal [&_br]:w-full"
              dangerouslySetInnerHTML={{ __html: effect.upper.join('') }}
            ></div>
          </fieldset>

          <fieldset className="fieldset  bg-base-200 border-accent rounded-box  border p-4 my-3">
            <legend className="fieldset-legend text-accent">
              <span className="badge badge-accent">Middle</span>
            </legend>
            <div
              className="label underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal [&_br]:w-full"
              dangerouslySetInnerHTML={{ __html: effect.middle.join('') }}
            ></div>
          </fieldset>

          <fieldset className="fieldset  bg-base-200 border-error rounded-box  border p-4 my-3">
            <legend className="fieldset-legend text-error">
              <span className="badge badge-error">Lower</span>
            </legend>
            <div
              className="label underline font-bold w-full flex flex-wrap items-center gap-1 wrap-break-word whitespace-normal"
              dangerouslySetInnerHTML={{ __html: effect.lower.join('') }}
            ></div>
          </fieldset>
        </div>
      );

    case "upper":
    case "middle":
    case "lower":
      return (
        <div
          className="label underline font-bold w-full flex flex-wrap items-center gap-1 wrap-break-word whitespace-normal"
          dangerouslySetInnerHTML={{ __html: effect.default.join('') }}
        ></div>
      );

    default:
      return null;
  }
}
