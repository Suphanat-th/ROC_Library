"use client";
import React, { useState, useMemo } from "react";
import { Trash2, Sparkles } from "lucide-react";
import { CategoryFilter } from "./CategoryFilter";
import { JobGrid } from "./JobGrid";
import { PreviewDisplay } from "./PreviewDisplay";

// Import Types และ Data จากไฟล์ที่คุณสร้างไว้
import {
  ALL_JOBS,
  CATEGORIES,
  COSTUME_SLOTS,
  INVENTORY_ITEMS,
  EquippedItems, // สำหรับ state equipped
  InventoryItem, // สำหรับตอนเลือก item
} from "@/types/jobs";

export default function App() {
  // 1. กำหนด Type ให้กับ State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedJob, setSelectedJob] = useState<string>("Novice");

  // ใช้ keyof เพื่อบอกว่า activeSlot ต้องตรงกับ id ใน COSTUME_SLOTS เท่านั้น
  const [activeSlot, setActiveSlot] = useState<string>("upper");

  // ใช้ Interface EquippedItems ที่เราเขียนไว้ในไฟล์ types
  const [equipped, setEquipped] = useState<EquippedItems>({
    upper: null,
    middle: null,
    lower: null,
    garment: null,
  });

  // 2. ข้อมูลที่ถูก Filter
  const filteredJobs = useMemo(() => {
    if (selectedCategory === "All") return ALL_JOBS;

    // ถ้าเลือกหมวดที่เริ่มต้นด้วยคำนั้น (เช่น 'EXPANDED' จะเจอ 'EXPANDED 1ST', 'EXPANDED 2ND')
    return ALL_JOBS.filter((j) => j.category.startsWith(selectedCategory));
  }, [selectedCategory]);
  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] text-slate-200 overflow-hidden p-4 gap-4 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* LEFT: Controls */}
      <aside className="w-[55%] h-full flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
        <header className="p-8 pb-4 shrink-0">
          {" "}
          {/* shrink-0 เพื่อไม่ให้ header โดนบีบ */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter italic uppercase text-white">
              Visual RAG
            </h1>
          </div>
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            categories={CATEGORIES}
          />
        </header>

        {/* Main Content Area: แบ่ง 30% / 70% */}
        <div className="flex-1 flex flex-col min-h-0">
          {" "}
          {/* min-h-0 สำคัญมากเพื่อให้ลูก scroll ได้ */}
          {/* SECTION 1: Select Job (30%) */}
          <section className="h-[30%] overflow-y-auto p-8 pt-2 scrollbar-thin scrollbar-thumb-white/5 border-b border-white/5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">
              Select Job
            </h2>
            <JobGrid
              jobs={filteredJobs}
              selected={selectedJob}
              onSelect={setSelectedJob}
            />
          </section>
          {/* SECTION 2: Costume & Inventory (70%) */}
          <section className="h-[70%] overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">
              Costume & Inventory
            </h2>

            {/* Costume Slots */}
            <div className="grid grid-cols-4 gap-3">
              {COSTUME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setActiveSlot(slot.id)}
                  className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    activeSlot === slot.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-dashed border-white/10 bg-white/5"
                  }`}
                >
                  <div
                    className={`${slot.color} ${activeSlot === slot.id ? "opacity-100" : "opacity-40"}`}
                  >
                    {equipped[slot.id as keyof EquippedItems] ? (
                      <span className="text-xl">
                        {equipped[slot.id as keyof EquippedItems]?.icon}
                      </span>
                    ) : (
                      <slot.icon size={16} />
                    )}
                  </div>
                  <span className="text-[8px] font-bold uppercase">
                    {slot.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Inventory Area */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-white/80">
                Inventory: <span className="text-blue-400">{activeSlot}</span>
              </h3>
              <div className="grid grid-cols-8 lg:grid-cols-10 gap-2 p-4 bg-black/40 rounded-[2rem] border border-white/5">
                {INVENTORY_ITEMS[activeSlot].map((item, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setEquipped((prev) => ({ ...prev, [activeSlot]: item }))
                    }
                    className="aspect-square bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/60 flex items-center justify-center transition-all group/item"
                  >
                    <div className="text-xl group-hover/item:scale-125 transition-transform">
                      {item.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* RIGHT: Preview */}
      <aside className="w-[45%] flex flex-col gap-4">
        <PreviewDisplay selectedJob={selectedJob} equipped={equipped} />
        <div className="h-[30%] bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 flex flex-col justify-center gap-4">
          <button
            onClick={() =>
              setEquipped({
                upper: null,
                middle: null,
                lower: null,
                garment: null,
              })
            }
            className="w-full py-4 rounded-2xl border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 uppercase font-black text-xs text-slate-400 hover:text-red-400"
          >
            <Trash2 size={14} /> Reset Outfit
          </button>
        </div>
      </aside>
    </div>
  );
}
