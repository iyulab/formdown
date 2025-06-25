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
  // SEO and Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Cache static assets
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*\\.(?:jpg|jpeg|png|gif|webp|svg|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
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
