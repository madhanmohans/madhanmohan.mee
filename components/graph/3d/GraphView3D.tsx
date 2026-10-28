'use client';

import { GraphViewShell } from '../GraphViewShell';
import type { GraphViewProps } from '../types';
import { BackgroundGraph3D } from './BackgroundGraph3D';
import { InteractiveGraph3D } from './InteractiveGraph3D';

export default function GraphView3D(props: GraphViewProps) {
  return (
    <GraphViewShell
      {...props}
      renderBackground={(graph) => <BackgroundGraph3D graph={graph} />}
      renderInteractive={(graph, containerRef) => (
        <InteractiveGraph3D graph={graph} containerRef={containerRef} />
      )}
    />
  );
}
