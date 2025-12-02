import { PatchItemsDto } from "@/types/patch";

export default function HeaderConvertPage({ item }: { item: PatchItemsDto }) {
  return (
    <h2 className="text-3xl font-extrabold bg-[#f7641a] text-white px-6 py-3 rounded-2xl shadow-md w-fit backdrop-blur-md col-span-6 inline-flex items-center">
      <img 
        className="rounded-xl mr-3"
        alt="item image"
        width={50}
        height={50}
        src={`/assets/images/GuildImage/dog.jpg`}>
          
        </img>
      {item.identifiedDisplayName}{" "}
      {!item.costume && item.slotCount > 0 && <span>[{item.slotCount}]</span>}
    </h2>
  );
}
