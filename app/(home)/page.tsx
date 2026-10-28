'use client';

import Link from 'next/link';
import { useState, useEffect, ViewTransition } from 'react';
import { GraphView } from '@/components/graph/GraphView';
import { SECOND_BRAIN_GRAPH_TRANSITION } from '@/components/graph/constants';
import { Tour } from '@/components/tour/Tour';
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
      {/* Shares a name with the /graph frame, so on click this hover preview
          morphs into the full graph instead of the page cutting to blank */}
      <ViewTransition
        name={SECOND_BRAIN_GRAPH_TRANSITION}
        share="morph"
        default="none"
      >
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            opacity: hoveredNavLink === 'second-brain' ? 0.3 : 0,
            transition: 'opacity 0.25s var(--ease-out-quart)',
          }}
        >
          <GraphView backgroundGraph dimension="2d" />
        </div>
      </ViewTransition>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <nav className="flex gap-4" style={{ fontSize: '14px' }}>
          <Link
            href="/graph"
            data-tour="second-brain"
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-150"
            onMouseEnter={() => setHoveredNavLink('second-brain')}
            onMouseLeave={() => setHoveredNavLink(null)}
          >
            second brain
          </Link>
          <a
            href="/resume.html"
            data-tour="about"
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-150"
            onMouseEnter={() => setHoveredNavLink('about')}
            onMouseLeave={() => setHoveredNavLink(null)}
          >
            about
          </a>
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
