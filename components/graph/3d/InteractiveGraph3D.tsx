'use client';

import { type RefObject, useMemo, useRef } from 'react';
import * as THREE from 'three';
import ForceGraph3D from 'react-force-graph-3d';
import { useRouter } from 'fumadocs-core/framework';
import { GraphTooltip } from '../GraphTooltip';
import { ZoomControls } from '../ZoomControls';
import {
  createForceGraphRef,
  enrichGraphNodesWithNeighbors,
  isLinkHighlighted,
} from '../graphUtils';
import { useNodeHoverTooltip } from '../useNodeHoverTooltip';
import type { ForceGraphInstance, Graph } from '../types';
import {
  ALPHA_DECAY,
  VELOCITY_DECAY,
  COOLDOWN_TIME,
  WARMUP_TICKS,
  ZOOM_TO_FIT_DURATION,
  ZOOM_TO_FIT_PADDING,
} from '../constants';
import { configureForces3D } from './configureForces3D';
import { createNodeObject, parseColorString } from './nodeObjects';

// Orbitable 3D graph that highlights a node's neighbourhood on hover
export function InteractiveGraph3D({
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
    (forceGraph, node) => forceGraph.graph2ScreenCoords(node.x, node.y, node.z),
  );

  const createNodeThreeObject = (node: any) => {
    const containerElement = containerRef.current;
    if (!containerElement) return new THREE.Mesh();
    return createNodeObject(
      node,
      hoveredNodeRef.current,
      getComputedStyle(containerElement),
    );
  };

  const resolveLinkColor = (link: any) => {
    const containerElement = containerRef.current;
    if (!containerElement) return '#999999';
    const computedStyles = getComputedStyle(containerElement);
    if (isLinkHighlighted(link, hoveredNodeRef.current)) {
      return computedStyles.getPropertyValue('--color-fd-ring');
    }

    return parseColorString(
      computedStyles,
      '--color-fd-muted-foreground',
      '#999999',
    );
  };

  const resolveLinkWidth = (link: any) =>
    isLinkHighlighted(link, hoveredNodeRef.current) ? 4 : 1;

  const graphDataWithNeighbors = useMemo(() => {
    return enrichGraphNodesWithNeighbors(graph);
  }, [graph]);

  return (
    <>
      <ForceGraph3D
        ref={createForceGraphRef(graphRef, configureForces3D)}
        graphData={graphDataWithNeighbors}
        nodeThreeObject={createNodeThreeObject}
        linkColor={resolveLinkColor}
        linkWidth={resolveLinkWidth}
        onNodeHover={handleNodeHover}
        onNodeClick={(clickedNode: any) => {
          router.push(clickedNode.url);
        }}
        enableNodeDrag
        enableNavigationControls
        d3AlphaDecay={ALPHA_DECAY}
        d3VelocityDecay={VELOCITY_DECAY}
        cooldownTime={COOLDOWN_TIME}
        warmupTicks={WARMUP_TICKS}
        showNavInfo={true}
        backgroundColor="rgba(0,0,0,0)"
      />

      <ZoomControls
        onFit={() =>
          graphRef.current?.zoomToFit(ZOOM_TO_FIT_DURATION, ZOOM_TO_FIT_PADDING)
        }
      />

      <GraphTooltip tooltip={tooltip} />
    </>
  );
}
