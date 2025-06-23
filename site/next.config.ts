import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@formdown/core', '@formdown/ui', '@formdown/editor'],
  output: 'export',
  distDir: 'publish',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
