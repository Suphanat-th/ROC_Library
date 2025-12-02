"use client";

import { PatchItemsDto } from "@/types/patch";
import HeaderConvertPage from "./header-convert";
import ImageConvertPage from "./image-convert";
import OptionConvertPage from "./option-convert";
import DetailConvertPage from "./detail-convert";
import { useItemDb } from "@/services/patchData/itemsService";
import * as htmlToImage from "html-to-image";

export default function PatchConvertPage() {
  const { items, loading, error } = useItemDb();

  const captureCard = async (key: string) => {
    const node = document.getElementById(`item${key}`);
    if (!node) return;

    const dataUrl = await htmlToImage.toPng(node, {
      backgroundColor: "transparent",
      pixelRatio: 3, // 1 = ปกติ, 2 = HD, 3 = Super HD
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = `item-${key}.png`;
    link.href = dataUrl;
    link.click();
  };

  const entries = Object.entries(items || {}); // เหมือน keyvalue pipe: [{key,value}, ...]

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full grid grid-col-1 justify-center mt-1">
      {entries.map(([key, item]) => (
        <div key={key} className="w-full">
          <button
            onClick={() => captureCard(key)}
            className="bg-linear-to-r text-white from-pink-500 to-purple-500 px-4 py-2 rounded-md font-semibold hover:brightness-110 mb-6"
          >
            💾 Download Image
          </button>

          <div
            id={`item${key}`}
            className="lg:max-w-5xl w-full mx-auto p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-linear-to-tr from-[#fd6c01] to-[#f0d29c] backdrop-blur-md border border-orange-200 flex flex-col gap-8 transition-all duration-300 hover:scale-[1.02]  bg-transparent"
          >
            <div className="grid grid-cols-6 items-start justify-center text-center w-full gap-6">
              <HeaderConvertPage item={item} />

              <div className="row-span-2 col-span-6 sm:col-span-6 md:col-span-2 mx-3 flex flex-col items-center bg-white/90 rounded-2xl p-4 shadow-inner">
                <ImageConvertPage patchKey={key} />

                <OptionConvertPage
                  identifiedDescriptionName={item.identifiedDescriptionName}
                />
              </div>

              <DetailConvertPage
                identifiedDescription={item.identifiedDescriptionName}
              />
            </div>
          </div>

          <br />
        </div>
      ))}
    </div>
  );
}
