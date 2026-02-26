"use client";
import { motion } from "framer-motion";
import EquipSlot from "./EquimentSlot"; // ไฟล์ที่เราแก้ Type แล้ว
import StatCard from "./StatCard";

export default function ROPage() {
    const scrollToDetail = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
    };

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
                            opacity: [1]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        // ใช้ absolute เพื่อให้ซ้อนทับ preview.png พอดี
                        className="absolute inset-0 z-20 w-full h-auto pointer-events-none mix-blend-screen"
                    />

                    {/* ป้ายชื่อ */}
                    <div className="absolute -bottom-10 bg-white/90 px-6 py-2 rounded-full shadow-lg font-black text-orange-600 z-30">
                        หมากัดหมวด
                    </div>
                </motion.div>

                {/* ไอเทมที่ลอยอยู่รอบๆ (Floating Elements) */}
                <div className="absolute inset-0 z-20 container mx-auto pointer-events-none">
                    {/* --- ฝั่งซ้าย (Left Side) --- */}


                    {/* หัว - บน (Upper) */}
                    <FloatingItem
                        pos="top-[10%] left-[10%] md:left-[20%]"
                        label="+9 Capicorn Cown []"
                        imageSrc="/assets/images/muad/upperhead.png"
                        onClick={() => scrollToDetail('item-head-upper')}
                    />
                    {/* หัว - กลาง (Middle) */}
                    <FloatingItem
                        pos="top-[10%] right-[10%] md:right-[20%]"
                        label="Karasu Tengu Mask"
                        imageSrc="/assets/images/muad/middlehead.png"
                        onClick={() => scrollToDetail('item-head-middle')}
                    />
                    {/* หัว - ล่าง (Lower) */}
                    <FloatingItem
                        pos="top-[25%] left-[5%] md:left-[15%]"
                        label="Mob Scarf"
                        imageSrc="/assets/images/muad/lowerhead.png"
                        onClick={() => scrollToDetail('item-head-lower')}
                    />
                    {/* เสื้อ (Armor) */}
                    <FloatingItem
                        pos="top-[25%] right-[10%] md:right-[10%]"
                        label="+9 Fallen Cool Armor <br><br>[Gloom Under Night Card]"
                        imageSrc="/assets/images/muad/armor.png"
                        onClick={() => scrollToDetail('item-armor')}
                    />

                    {/* อาวุธหลัก (Main Hand) */}
                    <FloatingItem
                        pos="top-[40%] left-[5%] md:left-[5%]"
                        label="+12 Scalet Dragon Leather Bow <br><br>[White Knight Card] <br>[Sealed Thanatos Card]"
                        imageSrc="/assets/images/muad/weapon.png"
                        onClick={() => scrollToDetail('item-weapon')}
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
                        label="+8 Temporal Agi Manteau []"
                        imageSrc="/assets/images/muad/garment.png"
                        onClick={() => scrollToDetail('item-garment')}
                    />
                    {/* รองเท้า (Shoes) */}
                    <FloatingItem
                        pos="bottom-[30%] right-[5%] md:right-[15%]"
                        label="+13 Inifinity Luck Boots [Hase Card]"
                        imageSrc="/assets/images/muad/shoes.png"
                        onClick={() => scrollToDetail('item-shoes')}
                    />

                    {/* ประดับ 1 (Accessory L) */}
                    <FloatingItem
                        pos="bottom-[15%] left-[10%] md:left-[20%]"
                        label="+12 Emerald Ring []"
                        imageSrc="/assets/images/muad/accessories.png"
                        onClick={() => scrollToDetail('item-accessories')}
                    />
                    {/* ประดับ 2 (Accessory R) */}
                    <FloatingItem
                        pos="bottom-[15%] right-[10%] md:right-[20%]"
                        label="+12 Emerald Ring []"
                        imageSrc="/assets/images/muad/accessories.png"
                        onClick={() => scrollToDetail('item-accessories2')}
                    />

                </div>

            </section>

            {/* SECTION 2: รายละเอียด (Details) */}
            <section id="item-head" className="min-h-screen flex items-center justify-center p-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-12 max-w-4xl w-full shadow-2xl">
                    <h2 className="text-4xl font-black mb-6 text-orange-600">ITEM DETAILS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div id="item-head-upper" className="p-6 bg-white rounded-2xl border-l-8 border-orange-500 shadow-sm">
                            <h3 className="text-xl font-bold">👒 +8 Feather Beret</h3>
                            <p className="text-slate-500 mt-2">MDEF + 1. Reduces damage from Humanoid monsters by 10%.</p>
                        </div>
                        <div id="item-weapon" className="p-6 bg-white rounded-2xl border-l-8 border-blue-500 shadow-sm">
                            <h3 className="text-xl font-bold">🗡️ Double Blood Sword</h3>
                            <p className="text-slate-500 mt-2">Critical Rate + 10. Heal 5% HP when killing monsters.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}


interface FloatingItemProps {
    pos: string;
    label: string;
    imageSrc: string; // เปลี่ยนจาก icon เป็น imageSrc
    onClick: () => void;
    delay?: number;   // เพิ่มเพื่อทำให้ไอเทมแต่ละชิ้นลอยไม่พร้อมกัน (ดูเป็นธรรมชาติขึ้น)
}
function FloatingItem({ pos, label, imageSrc, onClick, delay = 0 }: FloatingItemProps) {
    return (
        <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className={`absolute ${pos} pointer-events-auto cursor-pointer group z-30`}
            onClick={onClick}
        >
            <div className="relative bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl group-hover:bg-orange-500/90 transition-all duration-500 group-hover:scale-110 group-hover:shadow-orange-300/50 flex flex-col items-center justify-center">

                {/* ส่วนแสดงรูปไอเทม - ใช้ Flexbox เพื่อจัดให้อยู่กึ่งกลางเป๊ะ */}
                <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl mb-1 overflow-hidden transition-colors">
                    <img src={imageSrc}
                        alt={label}
                        className="w-[80%] h-[80%] object-contain drop-shadow-md group-hover:rotate-12 transition-transform duration-300"
                    />
                </div>

                {/* ชื่อประเภทไอเทม */}
                <div className="text-[12px] font-black uppercase text-slate-500 group-hover:text-white text-center tracking-widest leading-none mt-1" dangerouslySetInnerHTML={{ __html: label }}>

                </div>

                {/* Effect แสงวิ้งๆ */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
            </div>
        </motion.div>
    );
}