'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraphView, type Graph } from '@/components/Graph/GraphView';
import { ChessKing, Notebook, Waypoints } from 'lucide-react';
import { Tour } from '@/components/Tour';
import { GRAPH_API_URL } from '@/components/Graph/constants';

export default function SecondBrainPage() {
  const router = useRouter();
  const [graphData, setGraphData] = useState<Graph | null>(null);
  const [activeDimension, setActiveDimension] = useState<'2d' | '3d'>('3d');

  useEffect(() => {
    fetch(GRAPH_API_URL)
      .then((response) => response.json())
      .then((data: Graph) => setGraphData(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
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

        <div className="flex items-center gap-2">
          <div className="flex border border-fd-border rounded-md overflow-hidden">
            <button
              className="px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors duration-150"
              style={{
                background: activeDimension === '2d' ? 'var(--color-fd-accent)' : 'transparent',
                color: activeDimension === '2d' ? 'var(--color-fd-primary)' : 'var(--color-fd-muted-foreground)',
              }}
              onClick={() => setActiveDimension('2d')}
            >
              2D
            </button>
            <button
              className="px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors duration-150"
              style={{
                background: activeDimension === '3d' ? 'var(--color-fd-accent)' : 'transparent',
                color: activeDimension === '3d' ? 'var(--color-fd-primary)' : 'var(--color-fd-muted-foreground)',
              }}
              onClick={() => setActiveDimension('3d')}
            >
              3D
            </button>
          </div>

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
        </div>
      </header>

      <main className="flex-1 relative px-6 pb-8">
        {graphData && (
          <div
            className="w-full"
            style={{
              animation: 'fd-page-enter 0.6s var(--ease-out-quart) both',
            }}
          >
            <GraphView graph={graphData} dimension={activeDimension} />
          </div>
        )}

        {!graphData && (
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
