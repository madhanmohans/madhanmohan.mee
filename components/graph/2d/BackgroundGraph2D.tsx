'use client';

import { useMemo, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { createForceGraphRef } from '../graphUtils';
import type { ForceGraphInstance, Graph } from '../types';
import {
  TWO_D_GRAPH_NODE_RADIUS,
  ALPHA_DECAY,
  VELOCITY_DECAY,
  COOLDOWN_TIME,
  WARMUP_TICKS_BG,
  LINK_WIDTH_BG,
} from '../constants';
import { configureForces2D } from './configureForces2D';

// Static, non-interactive 2D graph used as a page backdrop
export function BackgroundGraph2D({
  container,
  graph,
}: {
  graph: Graph;
  container: HTMLDivElement;
}) {
  const computedStyles = getComputedStyle(container);
  const mutedForegroundColor = computedStyles
    .getPropertyValue('--color-fd-muted-foreground')
    .trim();
  const graphRef = useRef<ForceGraphInstance>(undefined);

  const clonedGraph = useMemo(() => {
    return structuredClone(graph);
  }, [graph]);

  const drawNodeOnCanvas = (node: any, context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.arc(
      node.x!,
      node.y!,
      TWO_D_GRAPH_NODE_RADIUS,
      0,
      2 * Math.PI,
      false,
    );
    context.fillStyle = mutedForegroundColor;
    context.fill();
  };

  const linkColor = `color-mix(in oklab, ${mutedForegroundColor} 30%, transparent)`;

  return (
    <ForceGraph2D
      ref={createForceGraphRef(graphRef, configureForces2D)}
      graphData={clonedGraph}
      nodeCanvasObject={drawNodeOnCanvas}
      linkColor={() => linkColor}
      linkWidth={LINK_WIDTH_BG}
      enableNodeDrag={false}
      enableZoomInteraction={false}
      enablePanInteraction={false}
      d3AlphaDecay={ALPHA_DECAY}
      d3VelocityDecay={VELOCITY_DECAY}
      cooldownTime={COOLDOWN_TIME}
      warmupTicks={WARMUP_TICKS_BG}
    />
  );
}
