'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ImageIcon, 
  Search, 
  Play, 
  Pause,
  Moon,
  Sun,
  FileUp,
  X,
  Loader2,
  ChevronDown,
  Monitor,
  Layers
} from 'lucide-react';

// --- Types ---
interface SPRFrame {
  width: number;
  height: number;
  dataUrl: string;
}

interface ROSpriteData {
  id: string;
  fileName: string;
  frames: SPRFrame[];
  currentFrameIdx: number;
  currentActionIdx: number;
  isPlaying: boolean;
  frameCount: number;
  isLoading: boolean;
  error?: string;
}

const RO_ANIMATIONS = [
  "0 - Idle", "1 - Walking", "2 - Sitting", "3 - Picking item", 
  "4 - Standby", "5 - Attacking1", "6 - Receiving damage", 
  "7 - Freeze1", "8 - Dead", "9 - Freeze2", "10 - Attacking2", 
  "11 - Attacking3", "12 - Casting spell"
];

// --- Core Decoding Logic (Fixed Transparency & RLE) ---
const decodeROSprite = async (file: File): Promise<{ frames: SPRFrame[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const view = new DataView(buffer);
        const frames: SPRFrame[] = [];
        
        const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1));
        if (magic !== 'SP') throw new Error('Invalid SPR file');

        const version = view.getUint16(2, true);
        const indexedCount = view.getUint16(4, true);
        let rgbaCount = 0;
        let offset = 6;
        
        if (version >= 0x201) {
          rgbaCount = view.getUint16(6, true);
          offset = 8;
        }

        // Palette is always at the end (1024 bytes)
        const paletteOffset = buffer.byteLength - 1024;
        const palette = new Uint8Array(buffer, paletteOffset, 1024);

        // 1. Process Indexed Frames
        for (let f = 0; f < indexedCount; f++) {
          const width = view.getUint16(offset, true);
          const height = view.getUint16(offset + 2, true);
          const dataLen = view.getUint16(offset + 4, true);
          offset += 6;

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          const imgData = ctx.createImageData(width, height);
          
          const rawPixelData = new Uint8Array(buffer, offset, dataLen);
          const pixels = new Uint8Array(width * height);
          
          let sIdx = 0, dIdx = 0;
          while (sIdx < dataLen && dIdx < pixels.length) {
            const b = rawPixelData[sIdx++];
            if (b === 0) {
              const count = rawPixelData[sIdx++];
              // Skip pixels (they remain transparent/0 in alpha)
              dIdx += (count === 0 ? 1 : count);
            } else {
              pixels[dIdx++] = b;
            }
          }

          for (let i = 0; i < pixels.length; i++) {
            const pIdx = pixels[i];
            const oIdx = i * 4;
            
            // Standard Rule: Index 0 in Sprite Palette is ALWAYS fully transparent
            if (pIdx === 0) {
              imgData.data[oIdx + 3] = 0;
            } else {
              imgData.data[oIdx] = palette[pIdx * 4];
              imgData.data[oIdx + 1] = palette[pIdx * 4 + 1];
              imgData.data[oIdx + 2] = palette[pIdx * 4 + 2];
              imgData.data[oIdx + 3] = 255;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          frames.push({ width, height, dataUrl: canvas.toDataURL() });
          offset += dataLen;
        }

        // 2. Process RGBA Frames
        for (let f = 0; f < rgbaCount; f++) {
          const width = view.getUint16(offset, true);
          const height = view.getUint16(offset + 2, true);
          offset += 4;
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          const imgData = ctx.createImageData(width, height);
          const rgba = new Uint8Array(buffer, offset, width * height * 4);
          imgData.data.set(rgba);
          ctx.putImageData(imgData, 0, 0);
          frames.push({ width, height, dataUrl: canvas.toDataURL() });
          offset += (width * height * 4);
        }
        resolve({ frames });
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sprites, setSprites] = useState<ROSpriteData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSprites(prev => prev.map(s => {
        if (!s.isPlaying || s.frameCount <= 1) return s;
        // Logic: Simulate action cycle by looping all frames 
        // In real ACT, this is more complex, but for preview we use all frames
        return { ...s, currentFrameIdx: (s.currentFrameIdx + 1) % s.frameCount };
      }));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsModalOpen(false);

    for (const file of Array.from(files)) {
      const id = Math.random().toString(36).substring(7);
      const entry: ROSpriteData = {
        id, fileName: file.name, frames: [], currentFrameIdx: 0,
        currentActionIdx: 0, isPlaying: true, frameCount: 0, isLoading: true
      };
      setSprites(prev => [entry, ...prev]);

      try {
        const result = await decodeROSprite(file);
        setSprites(prev => prev.map(s => s.id === id ? {
          ...s, frames: result.frames, frameCount: result.frames.length, isLoading: false
        } : s));
      } catch (err) {
        setSprites(prev => prev.map(s => s.id === id ? { ...s, isLoading: false, error: 'Fail' } : s));
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#09090b] text-zinc-100' : 'bg-zinc-50 text-zinc-900'} font-sans`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-[#09090b]/90 border-zinc-800' : 'bg-white/90 border-zinc-200'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <Monitor size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tighter italic leading-none uppercase">ROC Asset Library</h2>
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">Act Editor Simulator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
               <input 
                type="text" 
                placeholder="ค้นหา..." 
                className={`pl-10 pr-4 py-2 rounded-xl text-sm w-48 transition-all outline-none border ${isDarkMode ? 'bg-zinc-900 border-zinc-800 focus:border-red-500' : 'bg-zinc-100 border-zinc-200 focus:border-red-500'}`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
               />
             </div>
             <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all">
               Import SPR
             </button>
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl hover:bg-zinc-500/10 transition-colors">
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-12">
          {sprites.filter(s => s.fileName.toLowerCase().includes(searchTerm.toLowerCase())).map(spr => (
            <div key={spr.id} className={`flex flex-col lg:flex-row rounded-[40px] border overflow-hidden transition-all ${isDarkMode ? 'bg-[#121214] border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl'}`}>
              
              {/* Animation Viewport */}
              <div className={`relative flex-1 min-h-[500px] flex items-center justify-center border-b lg:border-b-0 lg:border-r ${isDarkMode ? 'bg-[#0c0c0e] border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
                     style={{ backgroundImage: `linear-gradient(${isDarkMode ? '#1e1e21' : '#e4e4e7'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#1e1e21' : '#e4e4e7'} 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
                </div>
                
                {spr.isLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                ) : spr.frames.length > 0 ? (
                  <div className="flex flex-col items-center gap-12">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-red-600/10 blur-[80px] rounded-full scale-150 opacity-50"></div>
                      <img 
                        src={spr.frames[spr.currentFrameIdx].dataUrl} 
                        className="relative z-10 scale-[6] md:scale-[8] object-contain transition-transform" 
                        style={{ imageRendering: 'pixelated' }} 
                      />
                    </div>
                    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
                        <span className="text-[10px] font-black uppercase text-red-500">Frame</span>
                        <span className="text-sm font-black text-white">{spr.currentFrameIdx} / {spr.frameCount - 1}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-500 font-black uppercase">Decoding Error</div>
                )}

                <button 
                  onClick={() => setSprites(s => s.filter(x => x.id !== spr.id))}
                  className="absolute top-8 left-8 p-3 rounded-2xl bg-black/40 hover:bg-red-600 text-white transition-all shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Inspector Sidebar */}
              <div className="w-full lg:w-[400px] p-10 flex flex-col">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500">
                      <Layers size={16} />
                    </div>
                    <h3 className="font-black text-xl uppercase italic tracking-tighter truncate">{spr.fileName}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black px-3 py-1 rounded-full bg-red-600 text-white uppercase tracking-widest">SPRITE TYPE 0X02</span>
                    <span className="text-[9px] font-black px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 uppercase tracking-widest">{spr.frameCount} TOTAL FRAMES</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 block">Action Sequence</label>
                    <div className="relative">
                      <select 
                        className={`w-full appearance-none pl-5 pr-12 py-4 rounded-2xl text-xs font-black outline-none border transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-800 focus:border-red-500' : 'bg-zinc-100 border-zinc-200 focus:border-red-500'}`}
                        value={spr.currentActionIdx}
                        onChange={e => setSprites(prev => prev.map(s => s.id === spr.id ? { ...s, currentActionIdx: parseInt(e.target.value), currentFrameIdx: 0 } : s))}
                      >
                        {RO_ANIMATIONS.map((n, i) => <option key={i} value={i}>{n}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                    </div>
                  </div>

                  <button 
                    onClick={() => setSprites(prev => prev.map(s => s.id === spr.id ? { ...s, isPlaying: !s.isPlaying } : s))}
                    className={`w-full flex items-center justify-center gap-4 py-5 rounded-3xl transition-all font-black text-xs uppercase tracking-[0.3em] ${spr.isPlaying ? 'bg-zinc-800 text-zinc-500 hover:text-white' : 'bg-red-600 text-white shadow-2xl shadow-red-600/40 hover:scale-[1.02]'}`}
                  >
                    {spr.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                    {spr.isPlaying ? 'Stop Animation' : 'Start Animation'}
                  </button>
                </div>

                <div className="mt-12 flex-1 flex flex-col min-h-0">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6 block">Frame Library (Extracted)</label>
                  <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
                    {spr.frames.map((f, i) => (
                      <button 
                        key={i}
                        onClick={() => setSprites(prev => prev.map(s => s.id === spr.id ? { ...s, currentFrameIdx: i, isPlaying: false } : s))}
                        className={`aspect-square rounded-2xl border p-2 transition-all relative group overflow-hidden ${spr.currentFrameIdx === i ? 'border-red-500 bg-red-500/10' : 'border-zinc-800 bg-zinc-950/40 opacity-50 hover:opacity-100 hover:border-zinc-600'}`}
                      >
                        <img src={f.dataUrl} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
                        <span className="absolute bottom-1 right-2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{i}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}

          {sprites.length === 0 && (
             <div className={`py-40 rounded-[60px] border-4 border-dashed flex flex-col items-center justify-center transition-all ${isDarkMode ? 'border-zinc-900 bg-zinc-900/10' : 'border-zinc-100 bg-zinc-50'}`}>
                <div className="w-24 h-24 bg-red-600/10 rounded-[32px] flex items-center justify-center mb-8 border border-red-600/20">
                  <ImageIcon size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase opacity-30 mb-8">Drop SPR File to Start</h3>
                <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-red-600/40">
                  Select Resources
                </button>
             </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className={`w-full max-w-xl rounded-[48px] overflow-hidden border ${isDarkMode ? 'bg-[#09090b] border-zinc-800' : 'bg-white border-zinc-100'}`}>
              <div className="p-12 text-center">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="group border-4 border-dashed border-zinc-900/50 rounded-[40px] p-24 cursor-pointer hover:border-red-600/50 hover:bg-red-600/5 transition-all flex flex-col items-center"
                 >
                   <input type="file" ref={fileInputRef} className="hidden" multiple accept=".spr" onChange={onFileChange} />
                   <div className="w-20 h-20 bg-zinc-900 rounded-[28px] flex items-center justify-center mb-8 group-hover:bg-red-600 transition-colors">
                     <FileUp size={28} className="text-zinc-600 group-hover:text-white" />
                   </div>
                   <p className="text-3xl font-black italic uppercase tracking-tighter mb-2">Import SPR</p>
                   <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.4em]">Ready for decoding assets</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="mt-12 text-zinc-600 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors">Cancel</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}</style>
    </div>
  );
};

export default App;