'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GraphView } from '@/components/Graph/GraphView';
import { Tour } from '@/components/Tour';
import {
  welcomePageTourStep,
  secondBrainPageTourStep,
  aboutPageTourStep,
} from './constants';

export default function HomePage() {
  const [hoveredNavLink, setHoveredNavLink] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-center flex-1 min-h-dvh overflow-hidden">
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          opacity: hoveredNavLink === 'second-brain' ? 0.3 : 0,
          transition: 'opacity 0.8s var(--ease-out-quart)',
        }}
      >
        <GraphView ghost />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <nav className="flex gap-4" style={{ fontSize: '14px' }}>
          <Link
            href="/graph"
            data-tour="second-brain"
            className="home-nav-link text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-300"
            onMouseEnter={() => setHoveredNavLink('second-brain')}
            onMouseLeave={() => setHoveredNavLink(null)}
          >
            second brain
          </Link>
          <Link
            href="/column/about-static"
            data-tour="about"
            className="home-nav-link text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-300"
            onMouseEnter={() => setHoveredNavLink('about')}
            onMouseLeave={() => setHoveredNavLink(null)}
          >
            about
          </Link>
        </nav>
      </div>
      <Tour
        id="home"
        steps={[
          welcomePageTourStep,
          secondBrainPageTourStep,
          aboutPageTourStep,
        ]}
      />
    </div>
  );
}
