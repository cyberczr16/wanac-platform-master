import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Required if you use next/image with static export
  images: {
    unoptimized: true,
  },

  // Turbopack will work without warnings
};

export default nextConfig;
