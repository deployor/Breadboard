import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.hackclub.com" },
      { protocol: "https", hostname: "assets.hackclub.com" },
    ],
  },
  reactCompiler: process.env.NODE_ENV === "production",
  turbopack: {
    root: __dirname,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/.archive/**",
          "**/temp/**",
          "**/.next/**",
          "**/node_modules/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
