
// /**
//  * ACT File Parser - รองรับโครงสร้างข้อมูลเบื้องต้นของไฟล์ .act
//  */
// export const parseAct = (arrayBuffer: ArrayBuffer): ActData | null => {
//   try {
//     const view = new DataView(arrayBuffer);
//     const signature = String.fromCharCode(view.getUint8(0), view.getUint8(1));
//     if (signature !== 'AC') return null;
//     const version = view.getUint16(2, true) / 10;
//     const actionCount = view.getUint16(4, true);
//     return { version, actionCount, arrayBuffer };
//   } catch (err) {
//     console.error("Error parsing ACT:", err);
//     return null;
//   }
// };

// /**
//  * SPR File Parser - อ่านข้อมูล Header และตรวจสอบประเภทการบีบอัด
//  */
// export const parseSpr = (arrayBuffer: ArrayBuffer): SprData | null => {
//   try {
//     const view = new DataView(arrayBuffer);
//     const sig = String.fromCharCode(view.getUint8(0), view.getUint8(1));
//     if (sig !== 'SP') return null;

//     const verMinor = view.getUint8(2);
//     const verMajor = view.getUint8(3);
    
//     const indexedCount = view.getUint16(4, true);
//     const rgbaCount = view.getUint16(6, true);

//     return { 
//       version: verMajor + (verMinor / 10), 
//       indexedImageCount: indexedCount || 0,
//       rgbaCount: rgbaCount || 0,
//       totalCount: (indexedCount || 0) + (rgbaCount || 0),
//       arrayBuffer,
//       isRle: verMajor >= 2 && verMinor >= 1 
//     };
//   } catch (err) {
//     console.error("Error parsing SPR:", err);
//     return null;
//   }
// };
