import { VIP } from "@/types/vip";
import rawData from "./vipDatabase.json";

/**
 * VIP Database - ดึงข้อมูลจาก vipDatabase.json
 * โครงสร้าง: รหัส, ชื่อ-นามสกุล, ชื่อ Facebook, Link Facebook, เบอร์โทรศัพท์
 */
export const vipDatabase: VIP[] = [
  ...rawData.vip.map((item, index) => ({
    id: index + 1,
    code: item.code,
    fullName: item.name,
    facebookName: item.facebookName,
    facebookUrl: item.facebookLink,
    phoneNumber: item.phone,
  })),
  ...rawData.mvp.map((item, index) => ({
    id: rawData.vip.length + index + 1,
    code: item.code,
    fullName: item.name,
    facebookName: item.facebookName,
    facebookUrl: item.facebookLink,
    phoneNumber: item.phone,
  })),
];
