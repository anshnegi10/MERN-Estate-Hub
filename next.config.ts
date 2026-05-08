import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  // Required by Next.js 16 Turbopack to correctly identify project root
  // when multiple package-lock.json files exist on the machine
  turbopack: {
    root: process.cwd()
  }
};


export default nextConfig;