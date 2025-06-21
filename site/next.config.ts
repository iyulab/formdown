import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@formdown/core', '@formdown/ui', '@formdown/editor'],
};

export default nextConfig;
