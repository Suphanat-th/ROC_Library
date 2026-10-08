import React, { useState } from "react";
import Image from "next/image";
import { ENCHANT_STONE_COST } from "@/data/enchantStoneData";

const IMAGES = {
  stone: "/assets/images/bp/EnchantStone.png",
  elunium: "/assets/images/bp/elu.png",
  oridecon: "/assets/images/bp/ori.png",
};

interface EnchantStoneSectionProps {
  formatNumber: (num: number | string) => string;
}

const parseNumber = (value: string) => {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
};

interface ItemRowProps {
  image: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
}

function ItemRow({ image, name, value, onChange }: ItemRowProps) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <div className="flex flex-col items-center text-center">
        <Image
          src={image}
          alt={name}
          width={120}
          height={120}
          className="mb-2 h-24 w-24 object-contain drop-shadow-md"
        />
        <span className="font-bold text-gray-700">{name}</span>
      </div>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(parseNumber(e.target.value))}
        placeholder="0"
        className="input input-bordered input-lg w-full border-blue-300 bg-white text-center text-3xl font-bold text-blue-600 focus:input-primary"
      />
    </div>
  );
}

export default function EnchantStoneSection({
  formatNumber,
}: EnchantStoneSectionProps) {
  const [wantedStones, setWantedStones] = useState(0);
  const [ownedElunium, setOwnedElunium] = useState(0);
  const [ownedOridecon, setOwnedOridecon] = useState(0);

  const needMaterials = wantedStones * ENCHANT_STONE_COST;

  const ownedMaterials = ownedElunium + ownedOridecon;
  const craftableStones = Math.floor(ownedMaterials / ENCHANT_STONE_COST);
  const leftoverMaterials = ownedMaterials % ENCHANT_STONE_COST;

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-linear-to-r from-blue-200/20 via-blue-400/70 to-blue-200/20"></div>
        <span className="rounded-full border border-blue-300/60 bg-blue-950/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-200">
          Enchant Stone Calculator
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-blue-200/20 via-blue-400/70 to-blue-200/20"></div>
      </div>

      <div className="card w-full border border-blue-900/80 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-sm">
        <div className="card-body p-4 sm:p-6 lg:p-7">
          <h2 className="card-title mb-2 flex items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl">
            <span className="text-2xl">💎</span> Enchant Stone Exchange
          </h2>
          <p className="mb-6 text-xs text-slate-400">
            1 Enchant Stone = {ENCHANT_STONE_COST} Elunium หรือ Oridecon
            (ผสมกันได้)
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-5 rounded-xl border-l-4 border-blue-500 bg-white p-6 text-slate-900 shadow-md">
              <div className="text-center font-bold text-gray-700">
                อยากได้ Enchant Stone
              </div>
              <ItemRow
                image={IMAGES.stone}
                name="Enchant Stone"
                value={wantedStones}
                onChange={setWantedStones}
              />
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="text-xs text-gray-500">
                  ต้องใช้ Elunium หรือ Oridecon รวมกัน
                </div>
                <div className="mt-1 flex items-center justify-center gap-3">
                  <Image src={IMAGES.elunium} alt="Elunium" width={48} height={48} className="h-10 w-10 object-contain" />
                  <span className="text-4xl font-black text-blue-700">
                    {formatNumber(needMaterials)}
                  </span>
                  <Image src={IMAGES.oridecon} alt="Oridecon" width={48} height={48} className="h-10 w-10 object-contain" />
                </div>
              </div>
            </div>

            <div className="space-y-5 rounded-xl border-l-4 border-blue-500 bg-white p-6 text-slate-900 shadow-md">
              <div className="text-center font-bold text-gray-700">
                มีวัตถุดิบอยู่แล้ว
              </div>
              <ItemRow
                image={IMAGES.elunium}
                name="Elunium"
                value={ownedElunium}
                onChange={setOwnedElunium}
              />
              <ItemRow
                image={IMAGES.oridecon}
                name="Oridecon"
                value={ownedOridecon}
                onChange={setOwnedOridecon}
              />
              <div className="grid grid-cols-2 items-center gap-4 rounded-lg bg-blue-50 p-4 text-center">
                <div className="flex flex-col items-center">
                  <Image
                    src={IMAGES.stone}
                    alt="Enchant Stone"
                    width={120}
                    height={120}
                    className="mb-1 h-20 w-20 object-contain drop-shadow-md"
                  />
                  <span className="text-xs text-gray-500">แลก Enchant Stone ได้</span>
                </div>
                <div>
                  <div className="text-5xl font-black text-blue-700">
                    {formatNumber(craftableStones)}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    เหลือ {formatNumber(leftoverMaterials)} (ยังไม่พอแลกอีกก้อน)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
