import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Correct key for Next.js 16 to prevent bundling Prisma (which avoids the Wasm error)
  serverExternalPackages: ["@prisma/client", "pg"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "t3.storage.dev" },
      { protocol: "https", hostname: "gibby-lms-nextjs.t3.storage.dev" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // ❌ NO webpack config here
};

export default nextConfig;
