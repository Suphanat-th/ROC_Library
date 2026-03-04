'use client';
import { useEffect, useRef } from 'react';

const SpriteCanvas: React.FC<SpriteCanvasProps> = ({ spr, frameIndex, scale = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!spr || !canvas || spr.totalCount === 0) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const view = new DataView(spr.arrayBuffer);
    
    // Palette อยู่ที่ 1024 bytes สุดท้ายของไฟล์เสมอ
    const paletteOffset = spr.arrayBuffer.byteLength - 1024;
    const palette = new Uint8Array(spr.arrayBuffer, paletteOffset, 1024);

    let currOffset = 8;
    let w = 0, h = 0;
    let isRgba = false;

    // 1. ค้นหาตำแหน่งของภาพ Indexed (8-bit)
    for (let i = 0; i < spr.indexedCount; i++) {
      const fw = view.getUint16(currOffset, true);
      const fh = view.getUint16(currOffset + 2, true);
      if (i === frameIndex) {
        w = fw; h = fh;
        currOffset += 4;
        break;
      }
      if (spr.isRle) {
        const cSize = view.getUint16(currOffset + 4, true);
        currOffset += 6 + cSize;
      } else {
        currOffset += 4 + (fw * fh);
      }
    }

    // 2. ค้นหาตำแหน่งของภาพ RGBA (32-bit) หากไม่พบใน Indexed
    if (w === 0 && frameIndex >= spr.indexedCount) {
      let rgbaSkipOffset = 8;
      for (let i = 0; i < spr.indexedCount; i++) {
        const fw = view.getUint16(rgbaSkipOffset, true);
        const fh = view.getUint16(rgbaSkipOffset + 2, true);
        if (spr.isRle) {
          const cSize = view.getUint16(rgbaSkipOffset + 4, true);
          rgbaSkipOffset += 6 + cSize;
        } else {
          rgbaSkipOffset += 4 + (fw * fh);
        }
      }

      currOffset = rgbaSkipOffset;
      for (let i = 0; i < spr.rgbaCount; i++) {
        const fw = view.getUint16(currOffset, true);
        const fh = view.getUint16(currOffset + 2, true);
        const globalIdx = spr.indexedCount + i;
        if (globalIdx === frameIndex) {
          w = fw; h = fh;
          isRgba = true;
          currOffset += 4;
          break;
        }
        currOffset += 4 + (fw * fh * 4);
      }
    }

    if (w <= 0 || h <= 0) return;

    canvas.width = w;
    canvas.height = h;
    const imgData = ctx.createImageData(w, h);

    if (!isRgba) {
      // ถอดรหัสภาพแบบ Indexed (8-bit)
      const pixels = new Uint8Array(w * h);
      if (spr.isRle) {
        const cSize = view.getUint16(currOffset, true);
        let rPos = currOffset + 2;
        let wPos = 0;
        const end = Math.min(rPos + cSize, paletteOffset);
        while (rPos < end && wPos < pixels.length) {
          const b = view.getUint8(rPos++);
          if (b === 0) {
            const count = view.getUint8(rPos++);
            wPos += count;
          } else {
            pixels[wPos++] = b;
          }
        }
      } else {
        pixels.set(new Uint8Array(spr.arrayBuffer, currOffset, w * h));
      }

      for (let i = 0; i < pixels.length; i++) {
        const pIdx = pixels[i];
        const r = i * 4;
        // บังคับให้ Index 0 โปร่งใส (Transparent)
        if (pIdx === 0) {
          imgData.data[r + 3] = 0;
        } else {
          const palIdx = pIdx * 4;
          imgData.data[r] = palette[palIdx];
          imgData.data[r + 1] = palette[palIdx + 1];
          imgData.data[r + 2] = palette[palIdx + 2];
          imgData.data[r + 3] = 255;
        }
      }
    } else {
      // ถอดรหัสภาพแบบ RGBA (32-bit)
      const rgbaData = new Uint8Array(spr.arrayBuffer, currOffset, w * h * 4);
      for (let i = 0; i < rgbaData.length; i += 4) {
        imgData.data[i] = rgbaData[i + 2];     // R
        imgData.data[i + 1] = rgbaData[i + 1]; // G
        imgData.data[i + 2] = rgbaData[i];     // B
        imgData.data[i + 3] = rgbaData[i + 3]; // A
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [spr, frameIndex]);

  return (
    <canvas 
      ref={canvasRef} 
      className="shadow-2xl transition-all duration-300"
      style={{ 
        width: 'auto', 
        height: 'auto', 
        maxWidth: '90%',
        maxHeight: '90%',
        transform: `scale(${scale})`,
        imageRendering: 'pixelated'
      }} 
    />
  );
};
export default SpriteCanvas; 