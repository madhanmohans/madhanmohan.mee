'use client';

import { type RefObject, useMemo, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useRouter } from 'fumadocs-core/framework';
import { GraphTooltip } from '../GraphTooltip';
import { ZoomControls } from '../ZoomControls';
import {
  createForceGraphRef,
  enrichGraphNodesWithNeighbors,
  isLinkHighlighted,
  isNodeHighlighted,
} from '../graphUtils';
import { useNodeHoverTooltip } from '../useNodeHoverTooltip';
import type { ForceGraphInstance, Graph } from '../types';
import {
  TWO_D_GRAPH_NODE_RADIUS,
  ALPHA_DECAY,
  VELOCITY_DECAY,
  COOLDOWN_TIME,
  WARMUP_TICKS,
  DEFAULT_LINK_COLOR,
  HIGHLIGHT_COLOR,
  LABEL_FONT_SIZE,
  LINK_WIDTH,
  ZOOM_FACTOR,
  ZOOM_ANIMATION_DURATION,
  ZOOM_TO_FIT_DURATION,
  ZOOM_TO_FIT_PADDING,
} from '../constants';
import { configureForces2D } from './configureForces2D';

// Clickable, zoomable 2D graph that highlights a node's neighbourhood on hover
export function InteractiveGraph2D({
  containerRef,
  graph,
}: {
  graph: Graph;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const graphRef = useRef<ForceGraphInstance>(undefined);
  const router = useRouter();
  const { tooltip, hoveredNodeRef, handleNodeHover } = useNodeHoverTooltip(
    graphRef,
    (forceGraph, node) => forceGraph.graph2ScreenCoords(node.x, node.y),
  );

  const drawNodeOnCanvas = (node: any, context: CanvasRenderingContext2D) => {
    if (!containerRef.current) return;
    const computedStyles = getComputedStyle(containerRef.current);
    const mutedForegroundColor = computedStyles
      .getPropertyValue('--color-fd-muted-foreground')
      .trim();
    context.beginPath();
    context.arc(
      node.x!,
      node.y!,
      TWO_D_GRAPH_NODE_RADIUS,
      0,
      2 * Math.PI,
      false,
    );

    const isActive = isNodeHighlighted(node, hoveredNodeRef.current);
    context.fillStyle = isActive ? HIGHLIGHT_COLOR : mutedForegroundColor;
    context.fill();

    context.font = `${LABEL_FONT_SIZE}px CommitMono, monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = computedStyles.getPropertyValue('color');
    context.fillText(
      node.text,
      node.x!,
      node.y! + TWO_D_GRAPH_NODE_RADIUS + LABEL_FONT_SIZE,
    );
  };

  const resolveLinkColor = (link: any) => {
    const containerElement = containerRef.current;
    if (!containerElement) return DEFAULT_LINK_COLOR;
    const computedStyles = getComputedStyle(containerElement);

    if (isLinkHighlighted(link, hoveredNodeRef.current)) {
      return computedStyles.getPropertyValue('--color-fd-primary');
    }

    return `color-mix(in oklab, ${computedStyles.getPropertyValue('--color-fd-muted-foreground')} 50%, transparent)`;
  };

  const graphDataWithNeighbors = useMemo(() => {
    return enrichGraphNodesWithNeighbors(graph);
  }, [graph]);

  function zoomByFactor(factor: number) {
    const forceGraphInstance = graphRef.current;
    if (!forceGraphInstance) return;
    forceGraphInstance.zoom(
      (forceGraphInstance.zoom() as number) * factor,
      ZOOM_ANIMATION_DURATION,
    );
  }

  return (
    <>
      <ForceGraph2D
        ref={createForceGraphRef(graphRef, configureForces2D)}
        graphData={graphDataWithNeighbors}
        nodeCanvasObject={drawNodeOnCanvas}
        linkColor={resolveLinkColor}
        onNodeHover={handleNodeHover}
        onNodeClick={(clickedNode: any) => {
          router.push(clickedNode.url);
        }}
        linkWidth={LINK_WIDTH}
        enableNodeDrag
        enableZoomInteraction
        d3AlphaDecay={ALPHA_DECAY}
        d3VelocityDecay={VELOCITY_DECAY}
        cooldownTime={COOLDOWN_TIME}
        warmupTicks={WARMUP_TICKS}
      />

      <ZoomControls
        onZoomIn={() => zoomByFactor(ZOOM_FACTOR)}
        onZoomOut={() => zoomByFactor(1 / ZOOM_FACTOR)}
        onFit={() =>
          graphRef.current?.zoomToFit(ZOOM_TO_FIT_DURATION, ZOOM_TO_FIT_PADDING)
        }
      />

      <GraphTooltip tooltip={tooltip} />
    </>
  );
}
