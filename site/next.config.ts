import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@formdown/core', '@formdown/ui', '@formdown/editor'],
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    distDir: 'publish',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true
  },
  // Optimize development experience
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          ignored: ['**/node_modules/**', '**/publish/**', '**/.next/**'],
          poll: 1000,
        }
      }
      return config
    }
  })
};

export default nextConfig;
