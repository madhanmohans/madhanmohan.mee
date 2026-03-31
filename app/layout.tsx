import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { GrainyBackground } from '@/components/grainy-background';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'madhanmohan.mee',
    template: '%s — madhanmohan.mee',
  },
  description: 'A personal second brain — notes, knowledge graph, and documentation.',
  openGraph: {
    title: 'madhanmohan.mee',
    description: 'A personal second brain — notes, knowledge graph, and documentation.',
    type: 'website',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <a
          href="#nd-page"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-fd-background focus:text-fd-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-fd-ring)]"
        >
          Skip to content
        </a>
        <RootProvider>
          <GrainyBackground />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
