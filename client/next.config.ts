import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: true, // ✅ Tells Next.js to ignore Babel
  },
};

export default nextConfig;
