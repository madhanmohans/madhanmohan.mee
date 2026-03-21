'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GraphView } from '@/components/graph-view';

export default function HomePage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative flex flex-col justify-center items-center flex-1 min-h-dvh overflow-hidden">
      {/* Ghost graph background on second-brain hover */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          opacity: hovered === 'second-brain' ? 0.3 : 0,
          transition: 'opacity 0.8s var(--ease-out-quart)',
        }}
      >
        <GraphView ghost />
      </div>

      {/* Content — nav as HUD, centered */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <nav
          className="flex gap-4"
          style={{
            fontFamily: "-apple-system, system-ui, sans-serif",
            fontSize: '14px',
            letterSpacing: '0.01em',
          }}
        >
          <Link
            href="/second-brain"
            className="home-nav-link text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-300"
            onMouseEnter={() => setHovered('second-brain')}
            onMouseLeave={() => setHovered(null)}
          >
            second brain
          </Link>
          <Link
            href="/about"
            className="home-nav-link text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-300"
            onMouseEnter={() => setHovered('about')}
            onMouseLeave={() => setHovered(null)}
          >
            about
          </Link>
        </nav>
      </div>
    </div>
  );
}
