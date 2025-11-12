import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <-- ทำให้ Next.js export เป็น static site
  reactCompiler: true,
};

export default nextConfig;
