'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraphView } from '@/components/graph/GraphView';
import { useGraphData } from '@/components/graph/useGraphData';
import { BrainCircuit } from 'lucide-react';
import { Tour } from '@/components/tour/Tour';
import { ViewToggle } from '@/components/layout/ViewToggle';

const GRAPH_DIMENSIONS = ['2d', '3d'] as const;

export default function SecondBrainPage() {
  const graphData = useGraphData();
  const [activeDimension, setActiveDimension] =
    useState<(typeof GRAPH_DIMENSIONS)[number]>('2d');

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-start justify-between px-12 py-5">
        <Link href="/" data-tour="home-link">
          <BrainCircuit />
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex border border-fd-border rounded-md overflow-hidden">
            {GRAPH_DIMENSIONS.map((dimension) => (
              <button
                key={dimension}
                className="px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors duration-150"
                style={{
                  background:
                    activeDimension === dimension
                      ? 'var(--color-fd-accent)'
                      : 'transparent',
                  color:
                    activeDimension === dimension
                      ? 'var(--color-fd-primary)'
                      : 'var(--color-fd-muted-foreground)',
                }}
                onClick={() => setActiveDimension(dimension)}
              >
                {dimension.toUpperCase()}
              </button>
            ))}
          </div>
          <ViewToggle />
        </div>
      </header>

      <main className="flex-1 relative px-6 pb-8">
        {graphData && (
          <div className="w-full fade-enter">
            <GraphView
              foregroundGraph={graphData}
              dimension={activeDimension}
            />
          </div>
        )}

        {!graphData && (
          <div
            className="h-[70vh] rounded-xl bg-fd-muted motion-safe:animate-pulse"
            role="status"
          >
            <span className="sr-only">loading...</span>
          </div>
        )}
      </main>

      <Tour
        id="second-brain"
        steps={[
          {
            id: 'welcome',
            title: 'second brain.',
            body: 'your knowledge as a graph. every note is a node. every link is an edge.',
            placement: 'center',
          },
          {
            id: 'graph',
            title: 'the graph',
            body: 'drag nodes to rearrange. hover to highlight connections. click to open a note.',
            placement: 'center',
          },
          {
            id: 'view-toggle',
            title: 'views',
            body: 'switch between graph view and docs view — two ways to navigate the same knowledge.',
            selector: '[data-tour="view-toggle"]',
            placement: 'bottom',
          },
          {
            id: 'home-link',
            title: 'home',
            body: 'return to the starting point.',
            selector: '[data-tour="home-link"]',
            placement: 'bottom',
          },
        ]}
      />
    </div>
  );
}
