'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GRAPH_HEIGHT, MAX_SIMULATION_TICKS } from '../constants';
import { useGraphData } from '../useGraphData';
import { attachPanZoom } from './attachPanZoom';
import { buildLocalSubgraph } from './buildLocalSubgraph';
import { findNodeAt, screenToWorld } from './canvasTransform';
import { drawLocalGraph, readLocalGraphColors } from './drawLocalGraph';
import { seedNodePositions, stepSimulation } from './localSimulation';
import type { CanvasTransform, LocalGraphNode, SimulationLink } from './types';

function useElementWidth(elementRef: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    setWidth(element.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return width;
}

// Minimap of the current note and the notes it links to or from
export function LocalGraph({ pageUrl }: { pageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchedGraphData = useGraphData();
  const containerWidth = useElementWidth(containerRef);
  const router = useRouter();

  const simulatedNodesRef = useRef<LocalGraphNode[]>([]);
  const canvasTransformRef = useRef<CanvasTransform>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const shouldRedrawRef = useRef(false);

  const localSubgraph = useMemo(
    () =>
      fetchedGraphData ? buildLocalSubgraph(fetchedGraphData, pageUrl) : null,
    [fetchedGraphData, pageUrl],
  );

  function findNodeAtScreen(screenX: number, screenY: number) {
    const world = screenToWorld(canvasTransformRef.current, screenX, screenY);
    return findNodeAt(
      simulatedNodesRef.current,
      canvasTransformRef.current,
      world.x,
      world.y,
    );
  }

  function findNodeUnderPointer(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return findNodeAtScreen(0, 0);
    const rect = canvas.getBoundingClientRect();
    return findNodeAtScreen(
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
  }

  function handleCanvasClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const clickedNode = findNodeUnderPointer(event);
    if (clickedNode) {
      event.preventDefault();
      router.push(clickedNode.id);
    }
  }

  function handleCanvasMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
    const hoveredNode = findNodeUnderPointer(event);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }
  }

  useEffect(() => {
    if (!localSubgraph || !containerWidth) return;
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')!;
    if (!context) return;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = containerWidth;
    const height = GRAPH_HEIGHT;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvasTransformRef.current = { scale: 1, offsetX: 0, offsetY: 0 };

    const simulationNodes = seedNodePositions(
      localSubgraph.nodes,
      width,
      height,
    );
    simulatedNodesRef.current = simulationNodes;

    const nodeByIdLookup = new Map(
      simulationNodes.map((node) => [node.id, node]),
    );
    const simulationLinks = localSubgraph.links
      .map((link) => ({
        source: nodeByIdLookup.get(link.source),
        target: nodeByIdLookup.get(link.target),
      }))
      .filter((link): link is SimulationLink => !!link.source && !!link.target);

    const colors = readLocalGraphColors(containerRef.current);

    const renderCanvas = () =>
      drawLocalGraph(context, {
        nodes: simulationNodes,
        links: simulationLinks,
        transform: canvasTransformRef.current,
        devicePixelRatio,
        width,
        height,
        colors,
      });

    // Simulate for a fixed number of frames, then only redraw on pan/zoom
    let animationFrameId: number;
    let simulationTick = 0;

    function animationLoop() {
      if (simulationTick < MAX_SIMULATION_TICKS) {
        stepSimulation(simulationNodes, simulationLinks, width, height);
        simulationTick++;
        renderCanvas();
      } else if (shouldRedrawRef.current) {
        shouldRedrawRef.current = false;
        renderCanvas();
      }
      animationFrameId = requestAnimationFrame(animationLoop);
    }

    const detachPanZoom = attachPanZoom(
      canvas,
      canvasTransformRef,
      () => {
        shouldRedrawRef.current = true;
      },
      (screenX, screenY) => !!findNodeAtScreen(screenX, screenY),
    );

    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      detachPanZoom();
    };
  }, [localSubgraph, containerWidth]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: `${GRAPH_HEIGHT}px`,
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--color-fd-border)',
          background: 'var(--color-fd-background)',
          boxShadow: '0 1px 3px rgba(17,24,39,0.04)',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          position: 'relative',
          marginBottom: '16px',
        }}
        className="graph-mini-container"
      >
        {localSubgraph && (
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              cursor: 'grab',
            }}
          />
        )}
      </div>
    </div>
  );
}
