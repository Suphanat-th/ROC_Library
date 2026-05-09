import { VIP } from "@/types/vip";
import rawData from "./vipDatabase.json";

/**
 * VIP Database - ดึงข้อมูลจาก vipDatabase.json
 * โครงสร้าง: รหัส, ชื่อ-นามสกุล, ชื่อ Facebook, Link Facebook, เบอร์โทรศัพท์
 */
export const vipDatabase: VIP[] = [
  ...rawData.map((item, index) => ({
    id: index + 1,
    code: item.code,
    fullName: item.fullName,
    facebookName: item.facebookName,
    facebookUrl: item.facebookUrl,
    phoneNumber: item.phoneNumber,
  })),
];
