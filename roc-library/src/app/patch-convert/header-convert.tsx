import { PatchItemsDto } from "@/types/patch";

export default function HeaderConvertPage({ item }: { item: PatchItemsDto }) {
  return (
    <h2 className="text-3xl font-extrabold bg-[#f55a0c] text-white px-6 py-3 rounded-2xl shadow-md w-fit backdrop-blur-md col-span-6">
      {item.identifiedDisplayName}{" "}
      {!item.costume && item.slotCount > 0 && <span>[{item.slotCount}]</span>}
    </h2>
  );
}
