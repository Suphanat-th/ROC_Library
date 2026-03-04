import { PreviewDisplayProps } from '@/types/jobs';
import { User as UserIcon } from 'lucide-react';

export const PreviewDisplay = ({ selectedJob, equipped }:PreviewDisplayProps) => (
  <div className="w-full h-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden">
    <div className="p-6 flex items-center justify-between z-10">
      <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-xs font-black text-blue-400 uppercase tracking-tighter">{selectedJob}</span>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center relative">
      <div className="absolute w-[80%] h-[80%] bg-blue-500/5 rounded-full blur-[100px]"></div>
      <div className="relative group/char">
        <div className="w-64 h-80 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center">
          <UserIcon size={180} className="text-white/10" strokeWidth={0.5} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {equipped.upper && <div className="absolute top-12 text-5xl animate-bounce">{equipped.upper.icon}</div>}
              {equipped.middle && <div className="absolute top-24 text-3xl opacity-90">{equipped.middle.icon}</div>}
              {equipped.garment && <div className="absolute -z-10 scale-[2.8] opacity-30 blur-[2px]">{equipped.garment.icon}</div>}
          </div>
        </div>
      </div>
    </div>
  </div>
);