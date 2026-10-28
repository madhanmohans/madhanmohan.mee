'use client';

import { type RefObject, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import ForceGraph3D from 'react-force-graph-3d';
import { useRouter } from 'fumadocs-core/framework';
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
  CAMERA_DISTANCE_PER_NODE_3D,
  INITIAL_ZOOM_3D,
  VELOCITY_DECAY,
  COOLDOWN_TIME,
  WARMUP_TICKS,
  ZOOM_TO_FIT_DURATION,
  ZOOM_TO_FIT_PADDING,
} from '../constants';
import { configureForces3D } from './configureForces3D';
import { createNodeObject, parseColorString } from './nodeObjects';

// Orbitable 3D graph that highlights a node's neighbourhood on hover (no
// note tooltip, unlike 2D)
export function InteractiveGraph3D({
  containerRef,
  graph,
}: {
  graph: Graph;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const graphRef = useRef<ForceGraphInstance>(undefined);
  const router = useRouter();
  // No note tooltip in 3D, but the hover state update still re-renders the
  // graph so the hovered node's neighbourhood highlights
  const { hoveredNodeRef, handleNodeHover } = useNodeHoverTooltip(
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

  // Open closer than the library's default framing. Runs once, after
  // ForceGraph3D has placed its default camera, so later data refreshes
  // don't undo the user's orbit
  const hasPositionedCameraRef = useRef(false);
  useEffect(() => {
    const forceGraphInstance = graphRef.current;
    if (hasPositionedCameraRef.current || !forceGraphInstance) return;
    if (!graphDataWithNeighbors.nodes.length) return;
    hasPositionedCameraRef.current = true;
    const defaultDistance =
      Math.cbrt(graphDataWithNeighbors.nodes.length) *
      CAMERA_DISTANCE_PER_NODE_3D;
    forceGraphInstance.cameraPosition({
      x: 0,
      y: 0,
      z: defaultDistance / INITIAL_ZOOM_3D,
    });
  }, [graphDataWithNeighbors]);

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
    </>
  );
}
