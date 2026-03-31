'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraphView, type Graph } from '@/components/graph-view';
import { ChessKing, GitGraph, Notebook, Waypoints } from 'lucide-react';
import { Tour } from '@/components/tour';

export default function SecondBrainPage() {
  const router = useRouter();
  const [graph, setGraph] = useState<Graph | null>(null);

  useEffect(() => {
    fetch('/api/graph')
      .then((r) => r.json())
      .then((data: Graph) => setGraph(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-start justify-between px-12 py-5">
        <Link
          href="/"
          data-tour="home-link"
          style={{
            fontFamily: "'Times New Roman', Georgia, serif",
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          <ChessKing />
        </Link>


        {/* View toggle */}
        <div className="flex border border-fd-border rounded-2xl" data-tour="view-toggle">
          <button
            className="view-toggle-btn"
            data-active={true}
          >
            <Waypoints size={16} />
          </button>
          <button
            className="view-toggle-btn"
            data-active={false}
            onClick={() => router.push('/docs')}
          >
            <Notebook size={16}/>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 relative px-6 pb-8">
        {graph && (
          <div
            className="w-full"
            style={{
              animation: 'fd-page-enter 0.6s var(--ease-out-quart) both',
            }}
          >
            <GraphView graph={graph} />
          </div>
        )}

        {!graph && (
          <div className="flex items-center justify-center h-96 text-fd-muted-foreground"
            style={{ fontSize: '13px', letterSpacing: '0.01em' }}
          >
            loading...
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
