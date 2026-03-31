'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GraphView } from '@/components/graph-view';
import { Tour } from '@/components/tour';

export default function HomePage() {
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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
        <nav className="flex gap-4" style={{ fontSize: '14px' }}>
          <Link
            href="/second-brain"
            data-tour="second-brain"
            className="home-nav-link text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-300"
            onMouseEnter={() => setHovered('second-brain')}
            onMouseLeave={() => setHovered(null)}
          >
            second brain
          </Link>
          <Link
            href="/about"
            data-tour="about"
            className="home-nav-link text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-300"
            onMouseEnter={() => setHovered('about')}
            onMouseLeave={() => setHovered(null)}
          >
            about
          </Link>
        </nav>
      </div>
      <Tour
        id="home"
        steps={[
          {
            id: 'welcome',
            title: 'welcome.',
            body: 'a personal second brain — notes, a knowledge graph, and a place where ideas connect.',
            placement: 'center',
          },
          {
            id: 'second-brain',
            title: 'second brain',
            body: 'an interactive knowledge graph. nodes are notes, edges are the connections between them.',
            selector: '[data-tour="second-brain"]',
            placement: 'bottom',
          },
          {
            id: 'about',
            title: 'about',
            body: "who i am and what i'm currently thinking about.",
            selector: '[data-tour="about"]',
            placement: 'bottom',
          },
        ]}
      />
    </div>
  );
}
