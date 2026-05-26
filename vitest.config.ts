import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}', '**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'lib/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'app/**/*.{ts,tsx}',
        'MDXComponents.tsx',
      ],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        'app/global.css',
        'app/api/og/**',
        '**/node_modules/**',
        '**/.next/**',
        '**/.source/**',
        'next.config.mjs',
        'postcss.config.mjs',
        'source.config.ts',
        'vitest.config.ts',
        'vitest.setup.ts',
        'lib/source.ts',
      ],
    },
  },
});
