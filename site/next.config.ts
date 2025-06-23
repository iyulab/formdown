import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@formdown/core', '@formdown/ui', '@formdown/editor'],
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
