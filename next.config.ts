import path from 'node:path';
import type { NextConfig } from 'next';
import { createMDX } from 'fumadocs-mdx/next';
import bundleAnalyzer from '@next/bundle-analyzer';
import { NOTES_BASE_URL } from './app/constants';

const withMDX = createMDX();
// Webpack-only: run via `npm run analyze`, which builds with --webpack
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

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
  // Only used by webpack builds (`npm run analyze`); webpack treats the
  // `fumadocs-mdx:` tsconfig alias as a URI scheme, so rewrite it to .source
  webpack(webpackConfig, { webpack }) {
    webpackConfig.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^fumadocs-mdx:collections\//,
        (resource: { request: string }) => {
          resource.request = path.join(
            import.meta.dirname,
            '.source',
            resource.request.slice('fumadocs-mdx:collections/'.length),
          );
        },
      ),
    );
    return webpackConfig;
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

export default withBundleAnalyzer(withMDX(config));
