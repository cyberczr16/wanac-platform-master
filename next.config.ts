import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ REQUIRED for Azure Static Web Apps (no SSR, no API)
  output: "export",

  // ✅ Required when using next/image with static export
  images: {
    unoptimized: true,
  },

  // Exclude jitsi-meet directory from webpack compilation
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /jitsi-meet/,
      })
    );

    return config;
  },
};

export default nextConfig;
