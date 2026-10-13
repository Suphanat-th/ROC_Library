"use client";
import { PageSkeleton } from "@/components/Loader";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import ItemCard from "../patch-convert/ItemCard";
import {
  useItemDbItemMUAD,
  useItemDbShadowMUAD,
} from "@/services/patchData/itemsService";
import ImageConvertPageMuad from "./ImageConvertPageMuad";
import { ItemInfoMuad } from "@/types/muad";

/** One equipment piece shown around the character. Text is plain data, not HTML. */
interface ShowcaseItem {
  /** id of the item card this piece scrolls to */
  target: string;
  imageSrc: string;
  title: string;
  /** cards / enchants, e.g. "Orc Hero" */
  tags?: string[];
  /** random options / effects */
  notes?: string[];
  side: "left" | "right";
}

const NORMAL_SHOWCASE: ShowcaseItem[] = [
  { target: "item-head-upper", imageSrc: "/assets/images/muad/upperhead.png", title: "+11 Shampoo []", tags: ["Orc Hero"], side: "left" },
  { target: "item-head-lower", imageSrc: "/assets/images/muad/lowerhead.png", title: "Frenzy Galapago", side: "left" },
  { target: "item-weapon", imageSrc: "/assets/images/muad/weapon.png", title: "+12 Awakened Narcissus Bow", tags: ["Thanatos", "Turtle General"], notes: ["เพิ่ม Physical Damage ระยะไกล 10%"], side: "left" },
  { target: "item-garment", imageSrc: "/assets/images/muad/garment.png", title: "+8 Temporal Agi Manteau []", notes: ["ลดดีเลย์หลังการใช้งาน Skill 15%", "เพิ่ม Physical Damage ระยะไกล 10%"], side: "left" },
  { target: "item-accessoriesR", imageSrc: "/assets/images/muad/accessoriesR.png", title: "+9 4th ROC Anniversary Ring []", tags: ["Zerom"], notes: ["Expert Archer Lv.10 (เพิ่มดาเมจระยะไกล 20% , ASPD+1)", "Agi3", "Agi4"], side: "left" },
  { target: "item-head-middle", imageSrc: "/assets/images/muad/middlehead.png", title: "Karasu Tengu Mask", notes: ["ลดดีเลย์หลังการใช้งาน Skill 10 %", "เพิ่ม Physical Damage ต่อมอนสเตอร์ประเภท Boss 8%"], side: "right" },
  { target: "item-armor", imageSrc: "/assets/images/muad/armor.png", title: "+9 Fallen Cool Armor []", side: "right" },
  { target: "item-shoes", imageSrc: "/assets/images/muad/shoes.png", title: "+15 Infinity Dexterity Boots []", notes: ["Hawkeye", "Expert Archer Lv.7 (เพิ่มดาเมจระยะไกล 14%)"], side: "right" },
  { target: "item-accessoriesL", imageSrc: "/assets/images/muad/accessoriesL.png", title: "+7 Falconer Ring []", tags: ["Zerom"], side: "right" },
];

const COSTUME_SHOWCASE: ShowcaseItem[] = [
  { target: "cos-head-upper", imageSrc: "/assets/images/muad/uppercos.png", title: "Costume Violet Rune Helm", tags: ["Sniper II"], side: "left" },
  { target: "cos-head-lower", imageSrc: "/assets/images/muad/lowercos.png", title: "Costume Aura of Tornado", tags: ["Sniper II"], side: "left" },
  { target: "shadow-waepon", imageSrc: "/assets/images/muad/waeponshadow.png", title: "+15 Shadow Sniper II Weapon", side: "left" },
  { target: "cos-garment", imageSrc: "/assets/images/muad/garmentcos.png", title: "Costume Giant Shark", tags: ["Sniper II"], side: "left" },
  { target: "shadow-pendant", imageSrc: "/assets/images/muad/pendantshadow.png", title: "+9 Almighty Shadow Pandant", notes: ["Max HP + 976", "CRI + 1", "ASPD + 1"], side: "left" },
  { target: "cos-head-middle", imageSrc: "/assets/images/muad/middlecos.png", title: "Costume Spotlight", tags: ["Sniper II"], side: "right" },
  { target: "shadow-armor", imageSrc: "/assets/images/muad/armorshadow.png", title: "+9 Critical Hit Shadow Armor", notes: ["MATK + 19", "เพิ่ม Physical Damage ระยะไกล 5%", "ATK + 1%"], side: "right" },
  { target: "shadow-shield", imageSrc: "/assets/images/muad/shieldshadow.png", title: "+12 Shadow Sniper II Shield", side: "right" },
  { target: "shadow-shoes", imageSrc: "/assets/images/muad/shoesshadow.png", title: "+9 Blitz Shadow Shoes", notes: ["ASPD + 1"], side: "right" },
  { target: "shadow-earring", imageSrc: "/assets/images/muad/earringshadow.png", title: "+9 Almighty Shadow Earring", notes: ["ATK + 12", "ลดร่าย 4%", "MHP+612"], side: "right" },
];

const itemInfoList = [
  { id: "400679", idClass: "item-head-upper", nameImg: "upperhead.png" },
  { id: "410517", idClass: "item-head-middle", nameImg: "middlehead.png" },
  { id: "420137", idClass: "item-head-lower", nameImg: "lowerhead.png" },
  { id: "450394", idClass: "item-armor", nameImg: "armor.png" },
  { id: "700013", idClass: "item-weapon", nameImg: "weapon.png" },
  { id: "20964", idClass: "item-garment", nameImg: "garment.png" },
  { id: "470356", idClass: "item-shoes", nameImg: "shoes.png" },
  { id: "490826", idClass: "item-accessoriesR", nameImg: "accessoriesR.png" },
  { id: "490323", idClass: "item-accessoriesL", nameImg: "accessoriesL.png" },
] as ItemInfoMuad[];

const cosInfoList = [
  { id: "15987", idClass: "cos-head-upper", nameImg: "uppercos.png" },
  { id: "410127", idClass: "cos-head-middle", nameImg: "middlecos.png" },
  { id: "31803", idClass: "cos-head-lower", nameImg: "lowercos.png" },
  { id: "15280", idClass: "shadow-armor", nameImg: "armorshadow.png" },
  { id: "1270076", idClass: "shadow-shield", nameImg: "shieldshadow.png" },
  { id: "1270063", idClass: "shadow-waepon", nameImg: "waeponshadow.png" },
  { id: "480126", idClass: "cos-garment", nameImg: "garmentcos.png" },
  { id: "24231", idClass: "shadow-shoes", nameImg: "shoesshadow.png" },
  { id: "24340", idClass: "shadow-pendant", nameImg: "pendantshadow.png" },
  { id: "24339", idClass: "shadow-earring", nameImg: "earringshadow.png" },
] as ItemInfoMuad[];

const STATS = [
  { label: "STR", value: "99+45", color: "text-red-300" },
  { label: "INT", value: "61+82", color: "text-blue-300" },
  { label: "AGI", value: "32+79", color: "text-green-300" },
  { label: "DEX", value: "102+91", color: "text-yellow-300" },
  { label: "VIT", value: "33+49", color: "text-orange-300" },
  { label: "LUK", value: "1+55", color: "text-purple-300" },
];

export default function ROPage() {
  const reduceMotion = useReducedMotion();
  const [isCostume, setIsCostume] = useState(false);

  const { items, loading, error } = useItemDbItemMUAD();
  const { itemsShadow, loadingShadow, errorShadow } = useItemDbShadowMUAD();

  const scrollToDetail = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  if (loading) return <PageSkeleton cards={3} />;
  if (error) return <p>Error: {error}</p>;

  const showcase = isCostume ? COSTUME_SHOWCASE : NORMAL_SHOWCASE;
  const infoList = isCostume ? cosInfoList : itemInfoList;
  const source = isCostume ? itemsShadow : items;
  const detailsLoading = isCostume && loadingShadow;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_center,#ffb347_0%,#ff8c00_50%,#e65100_100%)] pb-16">
      {/* SECTION 1: Showcase around the character */}
      <section
        aria-label="ชุดอุปกรณ์ของหมากัดหมวด"
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12"
      >
        <p className="mx-auto mb-6 w-fit rounded-full bg-black/45 px-4 py-1.5 text-center text-sm text-white">
          เลือกไอเทมเพื่อดูรายละเอียด
        </p>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_minmax(18rem,24rem)_1fr]">
          {/* Character */}
          <div className="flex flex-col items-center gap-5 lg:order-2">
            <div className="grid w-full max-w-xs grid-cols-3 gap-x-4 gap-y-2 rounded-2xl border border-white/20 bg-black/50 p-4 shadow-2xl backdrop-blur-md sm:max-w-sm">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center leading-tight"
                >
                  <span className="text-xs font-bold text-white/80">
                    {stat.label}
                  </span>
                  <span className={`text-base font-black ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            <motion.div
              initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex aspect-square w-64 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-[0_0_80px_rgba(255,255,255,0.3)] backdrop-blur-3xl md:w-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/muad/preview.png"
                alt="ตัวละครหมากัดหมวด"
                className="relative z-10 h-auto w-full drop-shadow-2xl"
              />
              <motion.img
                src="/assets/images/muad/effect.png"
                alt=""
                aria-hidden="true"
                style={{ originX: 0.5, originY: 1 }}
                animate={reduceMotion ? undefined : { rotate: [0, 3, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-0 z-10 h-auto w-full mix-blend-screen"
              />
            </motion.div>

            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-white px-6 py-2 text-base font-black text-orange-700 shadow-lg">
                หมากัดหมวด
              </div>

              <button
                type="button"
                aria-pressed={isCostume}
                onClick={() => setIsCostume(!isCostume)}
                className={`btn btn-sm gap-2 rounded-full border-0 shadow-md ${
                  isCostume
                    ? "bg-purple-700 text-white hover:bg-purple-800"
                    : "bg-white text-orange-800 hover:bg-orange-50"
                }`}
              >
                <RefreshCw aria-hidden="true" className="h-4 w-4" />
                {isCostume ? "VIEW NORMAL" : "VIEW COSTUME"}
              </button>
            </div>
          </div>

          {/* Items: left column, right column; stack under the character on small screens */}
          {(["left", "right"] as const).map((side, col) => (
            <ul
              key={side}
              className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 ${
                col === 0 ? "lg:order-1" : "lg:order-3"
              }`}
            >
              {showcase
                .filter((piece) => piece.side === side)
                .map((piece, i) => (
                  <li
                    key={piece.target}
                    className="roc-float"
                    style={{ animationDelay: `${(i % 5) * 0.4}s` }}
                  >
                    <ShowcaseChip
                      piece={piece}
                      onSelect={() => scrollToDetail(piece.target)}
                    />
                  </li>
                ))}
            </ul>
          ))}
        </div>
      </section>

      {/* SECTION 2: Item cards */}
      <section
        aria-label="รายละเอียดไอเทม"
        className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6"
      >
        {detailsLoading && <PageSkeleton cards={3} />}
        {isCostume && errorShadow && (
          <p role="alert" className="rounded-box bg-base-100 p-4 text-error">
            โหลดข้อมูลชุด Costume ไม่สำเร็จ: {errorShadow}
          </p>
        )}
        {!detailsLoading &&
          infoList.map((entry) => {
            const item = source?.[entry.id];
            if (!item) return null;
            return (
              <ItemCard
                key={entry.id}
                id={entry.idClass}
                item={item}
                image={<ImageConvertPageMuad patchKey={entry.nameImg} />}
              />
            );
          })}
      </section>
    </main>
  );
}

function ShowcaseChip({
  piece,
  onSelect,
}: {
  piece: ShowcaseItem;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-theme="roc-light"
      className="flex w-full cursor-pointer items-start gap-3 rounded-2xl bg-white/90 p-3 text-left shadow-xl transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={piece.imageSrc}
        alt=""
        className="h-10 w-10 shrink-0 object-contain drop-shadow-md"
      />
      <span className="min-w-0">
        <span className="block text-sm font-bold text-base-content underline">
          {piece.title}
        </span>
        {piece.tags && (
          <span className="mt-1 block text-xs font-semibold text-blue-700">
            {piece.tags.map((tag) => `[ ${tag} ]`).join(" ")}
          </span>
        )}
        {piece.notes?.map((note) => (
          <span key={note} className="mt-0.5 block text-xs text-red-700">
            {note}
          </span>
        ))}
      </span>
    </button>
  );
}
