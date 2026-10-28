import type { NextConfig } from 'next';
import { createMDX } from 'fumadocs-mdx/next';
import { NOTES_BASE_URL } from './app/constants';

const withMDX = createMDX();

const config: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'fumadocs-ui',
      'fumadocs-core',
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Browsers refuse plain HTTP for this host once they've seen it
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: `${NOTES_BASE_URL}/:path*.mdx`,
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);
