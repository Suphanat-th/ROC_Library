import React from 'react';
import { Job, JobGridProps } from '@/types/jobs';

export const JobGrid = ({ jobs, selected, onSelect }: JobGridProps) => {
  // 1. จัดกลุ่มอาชีพ (Grouping)
  const groupedJobs = jobs.reduce((acc, job) => {
    if (!acc[job.category]) acc[job.category] = [];
    acc[job.category].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  // 2. รายการหัวข้อทั้งหมดที่ต้องการให้แสดงเรียงลำดับ
  const allPossibleCategories = [
    'NOVICE', '1ST JOB', '2ND JOB', 'TRANSCENDENCE', 
    'EXPANDED 1ST', 'EXPANDED 2ND', 'EXPANDED 3RD'
  ];

  return (
    <div className="space-y-10 pb-10">
      {allPossibleCategories.map((cat) => {
        const jobsInCategory = groupedJobs[cat];
        
        // ถ้าไม่มีอาชีพในหมวดนี้ (เพราะโดน Filter ออก) ไม่ต้องแสดงหัวข้อ
        if (!jobsInCategory || jobsInCategory.length === 0) return null;

        return (
          <div key={cat} className="space-y-4">
            {/* ป้ายชื่อหมวดหมู่ (Label) */}
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/80">
                {cat}
              </span>
            </div>

            {/* Grid แสดงอาชีพ */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
              {jobsInCategory.map((job) => (
                <button
                  key={job.name}
                  onClick={() => onSelect(job.name)}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selected === job.name
                      ? 'border-blue-500 bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-105 z-10'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className={`text-3xl mb-2 transition-all group-hover:scale-110 ${
                    selected === job.name ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
                  }`}>
                    {job.icon}
                  </div>
                  <span className={`text-[10px] font-bold text-center leading-tight uppercase tracking-tighter ${
                    selected === job.name ? 'text-blue-300' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    {job.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};