import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <-- ทำให้ Next.js export เป็น static site
  distDir: "out", // Next.js จะสร้างโฟลเดอร์ static ที่นี่
  reactCompiler: true,
};

export default nextConfig;
