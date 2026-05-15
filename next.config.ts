/**
 * @nhom        : Cấu hình
 * @chucnang    : Cấu hình Next.js — images, redirects, etc.
 * @lienquan    : tsconfig.json, package.json
 * @alias       : next-config
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép dev origins — tránh lỗi WebSocket HMR cross-origin
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.1.25"],

  // Cho phép load ảnh từ Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
