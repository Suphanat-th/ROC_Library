"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import EquipSlot from "./EquimentSlot"; // ไฟล์ที่เราแก้ Type แล้ว
import StatCard from "./StatCard";
import HeaderConvertPage from "../patch-convert/header-convert";
import ImageConvertPage from "../patch-convert/image-convert";
import OptionConvertPage from "../patch-convert/option-convert";
import DetailConvertPage from "../patch-convert/detail-convert";
import SponserConvert from "../patch-convert/sponser-convert";
import {
  useItemDbItemMUAD,
  useItemDbShadowMUAD,
} from "@/services/patchData/itemsService";
import ImageConvertPageMuad from "./ImageConvertPageMuad";
import { ItemInfoMuad } from "@/types/muad";
export default function ROPage() {
  const scrollToDetail = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center", // เลื่อนมาไว้กลางจอในแนวตั้ง
      inline: "nearest", // จัดการในแนวนอน (ถ้ามี)
    });
  }; // 2. สร้าง State สำหรับสลับโหมด
  const [isCostume, setIsCostume] = useState(false);

  const { items, loading, error } = useItemDbItemMUAD();

  const { itemsShadow, loadingShadow, errorShadow } = useItemDbShadowMUAD();

  const itemInfoList = [
    {
      id: "400679",
      idClass: "item-head-upper",
      nameImg: "upperhead.png",
    },
    {
      id: "410517",
      idClass: "item-head-middle",
      nameImg: "middlehead.png",
    },
    {
      id: "420137",
      idClass: "item-head-lower",
      nameImg: "lowerhead.png",
    },
    {
      id: "450394",
      idClass: "item-armor",
      nameImg: "armor.png",
    },
    {
      id: "700013",
      idClass: "item-weapon",
      nameImg: "weapon.png",
    },
    {
      id: "20964",
      idClass: "item-garment",
      nameImg: "garment.png",
    },
    {
      id: "470356",
      idClass: "item-shoes",
      nameImg: "shoes.png",
    },
    {
      id: "490826",
      idClass: "item-accessoriesR",
      nameImg: "accessoriesR.png",
    },
    {
      id: "490323",
      idClass: "item-accessoriesL",
      nameImg: "accessoriesL.png",
    },
  ] as ItemInfoMuad[];

  const cosInfoList = [
    {
      id: "15987",
      idClass: "cos-head-upper",
      nameImg: "uppercos.png",
    },
    {
      id: "410127",
      idClass: "cos-head-middle",
      nameImg: "middlecos.png",
    },
    {
      id: "31803",
      idClass: "cos-head-lower",
      nameImg: "lowercos.png",
    },
    {
      id: "15280",
      idClass: "shadow-armor",
      nameImg: "armorshadow.png",
    },
    {
      id: "1270076",
      idClass: "shadow-shield",
      nameImg: "shieldshadow.png",
    },
    {
      id: "1270063",
      idClass: "shadow-waepon",
      nameImg: "waeponshadow.png",
    },
    {
      id: "480126",
      idClass: "cos-garment",
      nameImg: "garmentcos.png",
    },
    {
      id: "24231",
      idClass: "shadow-shoes",
      nameImg: "shoesshadow.png",
    },
    {
      id: "24340",
      idClass: "shadow-pendant",
      nameImg: "pendantshadow.png",
    },
    {
      id: "24339",
      idClass: "shadow-earring",
      nameImg: "earringshadow.png",
    },
  ] as ItemInfoMuad[];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="min-h-[200vh] bg-[radial-gradient(circle_at_center,_#ffb347_0%,_#ff8c00_50%,_#e65100_100%)]">
      {/* SECTION 1: หน้าจอหลัก (Hero) */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        {/* Scroll Indicator */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white animate-bounce text-sm">
          Scroll down or click item
        </div>
        {/* ตัวละครตรงกลาง */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-64 h-64 md:w-96 md:h-96 flex items-center justify-center bg-white/20 backdrop-blur-3xl rounded-full border border-white/30 shadow-[0_0_100px_rgba(255,255,255,0.3)]"
        >
          {/* 1. รูปตัวละครหลัก (Base Layer) */}
          <img
            src="/assets/images/muad/preview.png"
            alt="Character"
            className="relative z-10 w-full h-auto drop-shadow-2xl"
          />

          {/* 2. รูป Effect (Overlay Layer) - ใส่ Animation ให้ขยับได้ */}
          <motion.img
            src="/assets/images/muad/effect.png"
            style={{ originX: 0.5, originY: 1 }}
            alt="Effect"
            // Animation: ให้ขยายเข้าออก และหมุนช้าๆ ไปพร้อมกัน
            animate={{
              scale: [1],
              rotate: [0, 3, -3, 0],
              opacity: [1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            // ใช้ absolute เพื่อให้ซ้อนทับ preview.png พอดี
            className="absolute inset-0 z-20 w-full h-auto pointer-events-none mix-blend-screen"
          />

          {/* Status Card ด้านบน */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -top-35 bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl min-w-[300px]"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <StatRow label="STR" value="99+44" color="text-red-400" />
              <StatRow label="INT" value="61+84" color="text-blue-400" />
              <StatRow label="AGI" value="32+78" color="text-green-400" />
              <StatRow label="DEX" value="102+89" color="text-yellow-400" />
              <StatRow label="VIT" value="33+50" color="text-orange-400" />
              <StatRow label="LUK" value="1+54" color="text-purple-400" />
            </div>
          </motion.div>

          {/* ป้ายชื่อและปุ่ม ด้านล่าง */}
          <div className="absolute -bottom-24 flex flex-col items-center gap-3 z-30">
            <div className="bg-white/90 px-6 py-2 rounded-full shadow-lg font-black text-orange-600">
              หมากัดหมวด
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCostume(!isCostume)}
              className={`cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-md ${
                isCostume
                  ? "bg-purple-600 text-white"
                  : "bg-white text-slate-700 hover:bg-orange-100"
              }`}
            >
              <span className="text-sm">🔄</span>
              {isCostume ? "VIEW NORMAL" : "VIEW COSTUME"}
            </motion.button>
          </div>
        </motion.div>

        {/* ไอเทมที่ลอยอยู่รอบๆ (Floating Elements) */}
        <div className="absolute inset-0 z-20 container mx-auto pointer-events-none">
          {/* --- ฝั่งซ้าย (Left Side) --- */}

          {!isCostume ? (
            <>
              {/* หัว - บน (Upper) */}
              <FloatingItem
                pos="top-[10%] left-[10%] md:left-[20%]"
                label="<span class='underline font-bold text-[15px]'>+11 Shampoo []</span>"
                imageSrc="/assets/images/muad/upperhead.png"
                onClick={() => scrollToDetail("item-head-upper")}
              />
              {/* หัว - กลาง (Middle) */}
              <FloatingItem
                pos="top-[10%] right-[10%] md:right-[20%]"
                label="<span class='underline font-bold text-[15px]'>Karasu Tengu Mask</span><br><br><span class='text-red-500'>ลดดีเลย์หลังการใช้งาน Skill 10 %</span> <br><span class='text-red-500'>เพิ่ม Physical Damage ต่อมอนสเตอร์ประเภท Boss 8%</span>"
                imageSrc="/assets/images/muad/middlehead.png"
                onClick={() => scrollToDetail("item-head-middle")}
              />
              {/* หัว - ล่าง (Lower) */}
              <FloatingItem
                pos="top-[25%] left-[5%] md:left-[15%]"
                label="<span class='underline font-bold text-[15px]'>Frenzy Galapago"
                imageSrc="/assets/images/muad/lowerhead.png"
                onClick={() => scrollToDetail("item-head-lower")}
              />
              {/* เสื้อ (Armor) */}
              <FloatingItem
                pos="top-[25%] right-[10%] md:right-[10%]"
                label="<span class='underline font-bold text-[15px]'>+9 Fallen Cool Armor []</span>"
                imageSrc="/assets/images/muad/armor.png"
                onClick={() => scrollToDetail("item-armor")}
              />

              {/* อาวุธหลัก (Main Hand) */}
              <FloatingItem
                pos="top-[40%] left-[5%] md:left-[5%]"
                label="<span class='underline font-bold text-[15px]'>+12 Awakened Narcissus Bow</span> <br><br><span class='text-blue-500'>[ Thanatos ] <br>[ Turtle General  ]</span> <br><br><span class='text-red-500'>เพิ่ม Physical Damage ระยะไกล 10%</span>"
                imageSrc="/assets/images/muad/weapon.png"
                onClick={() => scrollToDetail("item-weapon")}
              />
              {/*                     
                    <FloatingItem
                        pos="top-[40%] right-[5%] md:right-[5%]"
                        label="Sub-Weapon"
                        imageSrc="/assets/images/muad/upperhead.png"
                        onClick={() => scrollToDetail('item-weapon2')}
                    /> */}

              {/* ผ้าคลุม (Garment) - สังเกตจากภาพต้นฉบับจะอยู่ฝั่งขวา */}
              <FloatingItem
                pos="bottom-[30%] left-[5%] md:left-[15%]"
                label="<span class='underline font-bold text-[15px]'>+8 Temporal Agi Manteau []</span><br><br><span class='text-red-500'>ลดดีเลย์หลังการใช้งาน Skill 15%<br>เพิ่ม Physical Damage ระยะไกล 10%</span>"
                imageSrc="/assets/images/muad/garment.png"
                onClick={() => scrollToDetail("item-garment")}
              />
              {/* รองเท้า (Shoes) */}
              <FloatingItem
                pos="bottom-[30%] right-[5%] md:right-[15%]"
                label="<span class='underline font-bold text-[15px]'>+15 Infinity Dexterity Boots []</span> <br><br><span class='text-red-500'>Hawkeye<br>Expert Archer Lv.7 (เพิ่มดาเมจระยะไกล 14%)</span>"
                imageSrc="/assets/images/muad/shoes.png"
                onClick={() => scrollToDetail("item-shoes")}
              />

              {/* ประดับ 1 (Accessory L) */}
              <FloatingItem
                pos="bottom-[15%] left-[10%] md:left-[20%]"
                label="<span class='underline font-bold text-[15px]'>+9 4th ROC <br>Anniversary Ring []</span><br><br><span class='text-blue-500'>[ Zerom ] </span><br><br><span class='text-red-500'>Expert Archer Lv.10 (เพิ่มดาเมจระยะไกล 20% , ASPD+1)<br>Agi3<br>Agi4</span>"
                imageSrc="/assets/images/muad/accessoriesR.png"
                onClick={() => scrollToDetail("item-accessoriesR")}
              />
              {/* ประดับ 2 (Accessory R) */}
              <FloatingItem
                pos="bottom-[15%] right-[10%] md:right-[20%]"
                label="<span class='underline font-bold text-[15px]'>+7 Falconer Ring []</span><br><br><span class='text-blue-500'>[ Zerom ] </span>"
                imageSrc="/assets/images/muad/accessoriesL.png"
                onClick={() => scrollToDetail("item-accessoriesL")}
              />
            </>
          ) : (
            <>
              {/* หัว - บน (Upper) */}
              <FloatingItem
                pos="top-[10%] left-[10%] md:left-[20%]"
                label="<span class='underline font-bold text-[15px]'>Costume Violet Rune Helm</span><br><br><span class='text-cyan-500'>[ Sniper II ]</span>"
                imageSrc="/assets/images/muad/uppercos.png"
                onClick={() => scrollToDetail("cos-head-upper")}
              />
              {/* หัว - กลาง (Middle) */}
              <FloatingItem
                pos="top-[10%] right-[10%] md:right-[20%]"
                label="<span class='underline font-bold text-[15px]'>Costume Spotlight</span><br><br><span class='text-cyan-500'>[ Sniper II ]</span>"
                imageSrc="/assets/images/muad/middlecos.png"
                onClick={() => scrollToDetail("cos-head-middle")}
              />
              {/* หัว - ล่าง (Lower) */}
              <FloatingItem
                pos="top-[25%] left-[5%] md:left-[15%]"
                label="<span class='underline font-bold text-[15px]'>Costume Aura of Tornado</span><br><br><span class='text-cyan-500'>[ Sniper II ]</span>"
                imageSrc="/assets/images/muad/lowercos.png"
                onClick={() => scrollToDetail("cos-head-lower")}
              />

              {/* เสื้อ (Armor) */}
              <FloatingItem
                pos="top-[25%] right-[10%] md:right-[10%]"
                label="<span class='underline font-bold text-[15px]'>+9 Critical Hit Shadow Armor</span><br><br><span class='text-red-500'>MATK + 19<br>เพิ่ม Physical Damage ระยะไกล 5%<br>ATK + 1%</span>"
                imageSrc="/assets/images/muad/armorshadow.png"
                onClick={() => scrollToDetail("shadow-armor")}
              />

              {/* อาวุธหลัก (Main Hand) */}
              <FloatingItem
                pos="top-[40%] left-[5%] md:left-[5%]"
                label="<span class='underline font-bold text-[15px]'>+15 Shadow Sniper II Weapon</span>"
                imageSrc="/assets/images/muad/waeponshadow.png"
                onClick={() => scrollToDetail("shadow-waepon")}
              />

              <FloatingItem
                pos="top-[40%] right-[5%] md:right-[5%]"
                label="<span class='underline font-bold text-[15px]'>+12 Shadow Sniper II Shield</span>"
                imageSrc="/assets/images/muad/shieldshadow.png"
                onClick={() => scrollToDetail("shadow-shield")}
              />

              {/* ผ้าคลุม (Garment) - สังเกตจากภาพต้นฉบับจะอยู่ฝั่งขวา */}
              <FloatingItem
                pos="bottom-[30%] left-[5%] md:left-[15%]"
                label="<span class='underline font-bold text-[15px]'>Costume Giant Shark </span><br><br><span class='text-cyan-500'>[Sniper II]</span>"
                imageSrc="/assets/images/muad/garmentcos.png"
                onClick={() => scrollToDetail("cos-garment")}
              />
              {/* รองเท้า (Shoes) */}
              <FloatingItem
                pos="bottom-[30%] right-[5%] md:right-[15%]"
                label="<span class='underline font-bold text-[15px]'>+9 Blitz Shadow Shoes</span><br><br><span class='text-red-500'>ASPD + 1</span>"
                imageSrc="/assets/images/muad/shoesshadow.png"
                onClick={() => scrollToDetail("shadow-shoes")}
              />

              {/* ประดับ 1 (Accessory L) */}
              <FloatingItem
                pos="bottom-[15%] left-[10%] md:left-[20%]"
                label="<span class='underline font-bold text-[15px]'>+9 Almighty Shadow Pandant</span><br><br><span class='text-red-500'>Max HP + 976<br>CRI + 1<br>ASPD + 1</span>"
                imageSrc="/assets/images/muad/pendantshadow.png"
                onClick={() => scrollToDetail("shadow-pendant")}
              />
              {/* ประดับ 2 (Accessory R) */}
              <FloatingItem
                pos="bottom-[15%] right-[10%] md:right-[20%]"
                label="<span class='underline font-bold text-[15px]'>+9 Almighty Shadow Earring</span><br><br><span class='text-red-500'>ATK + 12 <br>ลดร่าย 4% <br> MHP+612</span>"
                imageSrc="/assets/images/muad/earringshadow.png"
                onClick={() => scrollToDetail("shadow-earring")}
              />
            </>
          )}
        </div>
      </section>

      {/* SECTION 2: รายละเอียด (Details) */}
      {!isCostume ? (
        <>
          <section
            id="item-head"
            className="min-h-screen grid items-center justify-center p-10"
          >
            {itemInfoList.map((item) => {
              return (
                <div
                  key={item.id}
                  id={item.idClass}
                  className="lg:max-w-5xl w-full mx-auto p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-linear-to-tr from-[#fd6c01] to-[#f0d29c] backdrop-blur-md border border-orange-200 flex flex-col gap-8 transition-all duration-300 hover:scale-[1.02]  bg-transparent my-4"
                >
                  <div className="grid grid-cols-6 items-start justify-center text-center w-full gap-6">
                    <HeaderConvertPage item={items[item.id]} />

                    <div className="row-span-2 col-span-6 sm:col-span-6 md:col-span-2 mx-3 flex flex-col items-center bg-white/90 rounded-2xl p-4 shadow-inner">
                      <ImageConvertPageMuad patchKey={item.nameImg} />

                      <OptionConvertPage
                        identifiedDescriptionName={
                          items[item.id]?.identifiedDescriptionName
                        }
                      />
                    </div>

                    <DetailConvertPage
                      identifiedDescription={
                        items[item.id]?.identifiedDescriptionName
                      }
                    />
                  </div>
                </div>
              );
            })}
          </section>
        </>
      ) : (
        <>
          <section
            id="cos-head"
            className="min-h-screen grid items-center justify-center p-10"
          >
            {cosInfoList.map((item) => {
              return (
                <div
                  key={item.id}
                  id={item.idClass}
                  className="lg:max-w-5xl w-full mx-auto p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-linear-to-tr from-[#fd6c01] to-[#f0d29c] backdrop-blur-md border border-orange-200 flex flex-col gap-8 transition-all duration-300 hover:scale-[1.02]  bg-transparent my-4"
                >
                  <div className="grid grid-cols-6 items-start justify-center text-center w-full gap-6">
                    <HeaderConvertPage item={itemsShadow[item.id]} />

                    <div className="row-span-2 col-span-6 sm:col-span-6 md:col-span-2 mx-3 flex flex-col items-center bg-white/90 rounded-2xl p-4 shadow-inner">
                      <ImageConvertPageMuad patchKey={item.nameImg} />

                      <OptionConvertPage
                        identifiedDescriptionName={
                          itemsShadow[item.id]?.identifiedDescriptionName
                        }
                      />
                    </div>

                    <DetailConvertPage
                      identifiedDescription={
                        itemsShadow[item.id]?.identifiedDescriptionName
                      }
                    />
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}
      <ScrollUpButton />
    </main>
  );
}

function ScrollUpButton() {
  const smoothScroll = () => {
    if (typeof window === "undefined") return;

    const start = window.scrollY || window.pageYOffset;
    if (start === 0) return; // already at top

    const duration = 1000;
    const startTime = Date.now();

    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animateScroll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutQuad(progress);
      
      window.scrollTo(0, Math.max(0, start * (1 - easeProgress)));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <button
      aria-label="Scroll to top"
      onClick={smoothScroll}
      className="fixed bottom-24 right-6 z-[9999] w-12 h-12 rounded-full bg-linear-to-r from-purple-900 via-indigo-900 to-purple-700 text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="currentColor" d="M12 4l-8 8h5v8h6v-8h5z" />
      </svg>
    </button>
  );
}

interface FloatingItemProps {
  pos: string;
  label: string;
  imageSrc: string; // เปลี่ยนจาก icon เป็น imageSrc
  onClick: () => void;
  delay?: number; // เพิ่มเพื่อทำให้ไอเทมแต่ละชิ้นลอยไม่พร้อมกัน (ดูเป็นธรรมชาติขึ้น)
}
function FloatingItem({
  pos,
  label,
  imageSrc,
  onClick,
  delay = 0,
}: FloatingItemProps) {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={`absolute ${pos} pointer-events-auto cursor-pointer group z-30`}
      onClick={onClick}
    >
      {/* ปรับ flex-col เป็น flex-row และเพิ่ม gap-3 เพื่อเว้นระยะรูปกับข้อความ */}
      <div
        className="relative bg-white/80 backdrop-blur-md p-3 px-4 rounded-2xl shadow-xl 
                            group-hover:bg-orange-500/90 transition-all duration-500 
                            group-hover:scale-110 group-hover:shadow-orange-300/50 
                            flex flex-row items-center justify-center min-w-[150px]"
      >
        {/* ส่วนแสดงรูปไอเทม - อยู่ซ้ายมือ */}
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl overflow-hidden transition-colors shrink-0">
          <img
            src={imageSrc}
            alt={label}
            className="w-full h-full object-contain drop-shadow-md group-hover:rotate-12 transition-transform duration-300"
          />
        </div>

        <div className="ml-3 flex flex-col items-start">
          <div
            className="text-[12px] font-black uppercase text-slate-500 group-hover:text-white text-left tracking-wider leading-tight"
            dangerouslySetInnerHTML={{ __html: label }}
          />
        </div>

        {/* Effect แสงวิ้งๆ */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none" />
      </div>
    </motion.div>
  );
}
function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-[14px] font-black text-white/60 tracking-tighter">
        {label}
      </span>
      <span className={`text-[16px] font-black ${color} drop-shadow-sm`}>
        {value}
      </span>
    </div>
  );
}
