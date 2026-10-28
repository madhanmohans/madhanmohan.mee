'use client';

import { graphFrameShadow } from '../GraphFrame';
import { GraphViewShell } from '../GraphViewShell';
import type { GraphViewProps } from '../types';
import { BackgroundGraph2D } from './BackgroundGraph2D';
import { InteractiveGraph2D } from './InteractiveGraph2D';

export default function GraphView2D(props: GraphViewProps) {
  return (
    <GraphViewShell
      {...props}
      frameStyle={{ boxShadow: graphFrameShadow }}
      renderBackground={(graph, container) => (
        <BackgroundGraph2D graph={graph} container={container} />
      )}
      renderInteractive={(graph, containerRef) => (
        <InteractiveGraph2D graph={graph} containerRef={containerRef} />
      )}
    />
  );
}
