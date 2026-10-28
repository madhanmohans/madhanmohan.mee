'use client';

import { GraphViewShell } from '../GraphViewShell';
import type { GraphViewProps } from '../types';
import { BackgroundGraph2D } from './BackgroundGraph2D';
import { InteractiveGraph2D } from './InteractiveGraph2D';

export default function GraphView2D(props: GraphViewProps) {
  return (
    <GraphViewShell
      {...props}
      frameStyle={{
        boxShadow:
          '0 1px 2px rgba(17,24,39,0.04), 0 4px 8px rgba(17,24,39,0.02), 0 12px 24px rgba(17,24,39,0.015)',
      }}
      renderBackground={(graph, container) => (
        <BackgroundGraph2D graph={graph} container={container} />
      )}
      renderInteractive={(graph, containerRef) => (
        <InteractiveGraph2D graph={graph} containerRef={containerRef} />
      )}
    />
  );
}
