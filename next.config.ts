import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inovacont.com.br",
      },
    ],
  },
};

export default nextConfig;
