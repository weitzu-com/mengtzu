import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel builds from an ASCII path, but local Desktop paths include Chinese
  // characters. Webpack avoids a Turbopack path-slicing panic in Next 16.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
