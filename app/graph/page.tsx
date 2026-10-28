'use client';

import { useState, ViewTransition } from 'react';
import { GraphView } from '@/components/graph/GraphView';
import { GraphFramePlaceholder } from '@/components/graph/GraphFrame';
import { SECOND_BRAIN_GRAPH_TRANSITION } from '@/components/graph/constants';
import { useGraphData } from '@/components/graph/useGraphData';
import { Tour } from '@/components/tour/Tour';
import {
  GraphIsland,
  type GraphDimension,
} from '@/components/layout/GraphIsland';

export default function SecondBrainPage() {
  const graphData = useGraphData();
  const [activeDimension, setActiveDimension] = useState<GraphDimension>('2d');

  return (
    <div className="min-h-dvh flex flex-col">
      {/* No page-enter animation: arriving from home, the view transition
          crossfades the page and morphs the hover graph into this frame */}
      <main className="flex-1 relative p-6 animate-none">
        <ViewTransition
          name={SECOND_BRAIN_GRAPH_TRANSITION}
          share="morph"
          default="none"
        >
          {graphData ? (
            <GraphView
              foregroundGraph={graphData}
              dimension={activeDimension}
            />
          ) : (
            <GraphFramePlaceholder withShadow={activeDimension === '2d'} />
          )}
        </ViewTransition>
      </main>

      <GraphIsland
        dimension={activeDimension}
        onDimensionChange={setActiveDimension}
      />

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
            placement: 'top',
          },
          {
            id: 'home-link',
            title: 'home',
            body: 'return to the starting point.',
            selector: '[data-tour="home-link"]',
            placement: 'top',
          },
        ]}
      />
    </div>
  );
}
