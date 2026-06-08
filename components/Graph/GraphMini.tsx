'use client';

import {
  HIT_RADIUS,
  GRAPH_HEIGHT,
  MAX_SIMULATION_TICKS,
  MIN_ZOOM,
  MAX_ZOOM,
  GRAPH_API_URL,
} from './constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Graph } from '@/components/Graph/GraphView';
import type { MiniNode, GraphMiniProps, MiniLink } from './GraphShared';

export function GraphMini({ pageUrl }: GraphMiniProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fetchedGraphData, setFetchedGraphData] = useState<Graph | null>(null);
  const router = useRouter();

  const simulatedNodesRef = useRef<MiniNode[]>([]);
  const canvasTransformRef = useRef({ scale: 1, offsetX: 0, offsetY: 0 });
  const shouldRedrawRef = useRef(false);

  useEffect(() => {
    fetch(GRAPH_API_URL)
      .then((response) => response.json())
      .then((data: Graph) => setFetchedGraphData(data))
      .catch(() => { });
  }, []);

  const localSubgraph = useMemo(() => {
    if (!fetchedGraphData) return null;

    const connectedNodeIds = new Set<string>();
    connectedNodeIds.add(pageUrl);

    for (const link of fetchedGraphData.links) {
      const sourceId =
        typeof link.source === 'object'
          ? (link.source as { id: string }).id
          : (link.source as string);
      const targetId =
        typeof link.target === 'object'
          ? (link.target as { id: string }).id
          : (link.target as string);
      if (sourceId === pageUrl) connectedNodeIds.add(targetId);
      if (targetId === pageUrl) connectedNodeIds.add(sourceId);
    }

    const nodes: MiniNode[] = fetchedGraphData.nodes
      .filter((node) => connectedNodeIds.has(node.id as string))
      .map((node) => ({
        id: node.id as string,
        text: node.text,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        isCurrent: node.id === pageUrl,
      }));

    if (nodes.length === 0) {
      nodes.push({
        id: pageUrl,
        text: 'Current',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        isCurrent: true,
      });
    }

    const links: MiniLink[] = fetchedGraphData.links
      .filter((link) => {
        const sourceId =
          typeof link.source === 'object'
            ? (link.source as { id: string }).id
            : (link.source as string);
        const targetId =
          typeof link.target === 'object'
            ? (link.target as { id: string }).id
            : (link.target as string);
        return connectedNodeIds.has(sourceId) && connectedNodeIds.has(targetId);
      })
      .map((link) => ({
        source:
          typeof link.source === 'object'
            ? (link.source as { id: string }).id
            : (link.source as string),
        target:
          typeof link.target === 'object'
            ? (link.target as { id: string }).id
            : (link.target as string),
      }));

    return { nodes, links };
  }, [fetchedGraphData, pageUrl]);

  function screenToWorld(screenX: number, screenY: number) {
    const { scale, offsetX, offsetY } = canvasTransformRef.current;
    return {
      x: (screenX - offsetX) / scale,
      y: (screenY - offsetY) / scale,
    };
  }

  function getCanvasCoordinates(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function findNodeAt(worldX: number, worldY: number): MiniNode | null {
    const { scale } = canvasTransformRef.current;
    const scaleCompensatedHitRadius = HIT_RADIUS / scale;
    for (const node of simulatedNodesRef.current) {
      const dx = node.x - worldX;
      const dy = node.y - worldY;
      if (
        dx * dx + dy * dy <=
        scaleCompensatedHitRadius * scaleCompensatedHitRadius
      )
        return node;
    }
    return null;
  }

  function handleCanvasClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvasCoordinates = getCanvasCoordinates(event);
    const worldCoordinates = screenToWorld(
      canvasCoordinates.x,
      canvasCoordinates.y,
    );
    const clickedNode = findNodeAt(worldCoordinates.x, worldCoordinates.y);
    if (clickedNode) {
      event.preventDefault();
      router.push(clickedNode.id);
    }
  }

  function handleCanvasMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvasCoordinates = getCanvasCoordinates(event);
    const worldCoordinates = screenToWorld(
      canvasCoordinates.x,
      canvasCoordinates.y,
    );
    const hoveredNode = findNodeAt(worldCoordinates.x, worldCoordinates.y);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }
  }

  useEffect(() => {
    if (!localSubgraph || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = canvas.getContext('2d')!;
    if (!context) return;

    const rect = container.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = GRAPH_HEIGHT;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvasTransformRef.current = { scale: 1, offsetX: 0, offsetY: 0 };

    const simulationNodes = localSubgraph.nodes.map((node, index) => ({
      ...node,
      x: node.isCurrent
        ? width / 2
        : width / 2 + Math.cos(index * 2.4) * Math.min(width, height) * 0.3,
      y: node.isCurrent
        ? height / 2
        : height / 2 + Math.sin(index * 2.4) * Math.min(width, height) * 0.3,
      vx: 0,
      vy: 0,
    }));

    simulatedNodesRef.current = simulationNodes;

    const nodeByIdLookup = new Map(
      simulationNodes.map((node) => [node.id, node]),
    );
    const simulationLinks = localSubgraph.links
      .map((link) => ({
        source: nodeByIdLookup.get(link.source),
        target: nodeByIdLookup.get(link.target),
      }))
      .filter(
        (link): link is { source: MiniNode; target: MiniNode } =>
          !!link.source && !!link.target,
      );

    const computedStyles = getComputedStyle(container);
    const mutedForegroundColor = computedStyles.getPropertyValue('--color-fd-muted-foreground').trim();
    const activeNodeColor = computedStyles.getPropertyValue('--color-fd-ring').trim();
    const textForegroundColor = computedStyles.getPropertyValue('color').trim();
    const linkStrokeColor = `color-mix(in oklab, ${mutedForegroundColor} 40%, transparent)`;

    let animationFrameId: number;
    let simulationTick = 0;

    function runForceSimulation() {
      for (const nodeA of simulationNodes) {
        nodeA.vx += (width / 2 - nodeA.x) * 0.005;
        nodeA.vy += (height / 2 - nodeA.y) * 0.005;
        for (const nodeB of simulationNodes) {
          if (nodeA === nodeB) continue;
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 200 / (dist * dist);
          nodeA.vx += (dx / dist) * force;
          nodeA.vy += (dy / dist) * force;
        }
      }
      for (const link of simulationLinks) {
        const dx = link.target.y - link.source.x;
        const dy = link.target.y - link.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDistance = 50;
        const force = (dist - targetDistance) * 0.02;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        link.source.vx += fx;
        link.source.vy += fy;
        link.target.vx -= fx;
        link.target.vy -= fy;
      }
      for (const node of simulationNodes) {
        node.vx *= 0.7;
        node.vy *= 0.7;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(20, Math.min(width - 20, node.x));
        node.y = Math.max(20, Math.min(height - 30, node.y));
      }
    }

    function renderCanvas() {
      const { scale, offsetX, offsetY } = canvasTransformRef.current;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      context.setTransform(
        devicePixelRatio * scale,
        0,
        0,
        devicePixelRatio * scale,
        devicePixelRatio * offsetX,
        devicePixelRatio * offsetY,
      );

      context.strokeStyle = linkStrokeColor;
      context.lineWidth = 1 / scale;
      for (const link of simulationLinks) {
        context.beginPath();
        context.moveTo(link.source.x, link.source?.y);
        context.lineTo(link.target.x, link.target?.y);
        context.stroke();
      }

      for (const node of simulationNodes) {
        const radius = (node.isCurrent ? 5 : 3) / scale;

        context.beginPath();
        context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        context.fillStyle = node.isCurrent ? activeNodeColor : mutedForegroundColor;
        context.fill();

        const fontSize = (node.isCurrent ? 10 : 8) / scale;
        context.font = `${fontSize}px CommitMono, monospace`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillStyle = node.isCurrent
          ? textForegroundColor
          : mutedForegroundColor;

        let label = node.text;
        if (label.length > 16) label = label.slice(0, 14) + '…';
        context.fillText(label, node.x, node.y + radius + 3 / scale);
      }
    }

    function animationLoop() {
      if (simulationTick < MAX_SIMULATION_TICKS) {
        runForceSimulation();
        simulationTick++;
        renderCanvas();
      } else if (shouldRedrawRef.current) {
        shouldRedrawRef.current = false;
        renderCanvas();
      }
      animationFrameId = requestAnimationFrame(animationLoop);
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      event.stopPropagation();

      const { scale, offsetX, offsetY } = canvasTransformRef.current;
      const canvasRect = canvas.getBoundingClientRect();

      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const zoomFactor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
      const newScale = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, scale * zoomFactor),
      );

      const scaleRatio = newScale / scale;
      const newOffsetX = mouseX - (mouseX - offsetX) * scaleRatio;
      const newOffsetY = mouseY - (mouseY - offsetY) * scaleRatio;

      canvasTransformRef.current = {
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      };
      shouldRedrawRef.current = true;
    }

    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let panStartOffsetX = 0;
    let panStartOffsetY = 0;

    function handleMouseDown(event: MouseEvent) {
      const canvasRect = canvas.getBoundingClientRect();
      const screenX = event.clientX - canvasRect.left;
      const screenY = event.clientY - canvasRect.top;
      const worldCoordinates = screenToWorld(screenX, screenY);
      if (findNodeAt(worldCoordinates.x, worldCoordinates.y)) return;

      isPanning = true;
      panStartX = event.clientX;
      panStartY = event.clientY;
      panStartOffsetX = canvasTransformRef.current.offsetX;
      panStartOffsetY = canvasTransformRef.current.offsetY;
      canvas.style.cursor = 'grabbing';
    }

    function handleMouseMoveNative(event: MouseEvent) {
      if (!isPanning) return;
      const dx = event.clientX - panStartX;
      const dy = event.clientY - panStartY;
      canvasTransformRef.current.offsetX = panStartOffsetX + dx;
      canvasTransformRef.current.offsetY = panStartOffsetY + dy;
      shouldRedrawRef.current = true;
    }

    function handleMouseUp() {
      if (isPanning) {
        isPanning = false;
        canvas.style.cursor = 'grab';
      }
    }

    let activeTouches: Touch[] = [];
    let lastPinchDistance = 0;
    let lastPinchMidX = 0;
    let lastPinchMidY = 0;
    let isTouchPanActive = false;
    let touchPanStartX = 0;
    let touchPanStartY = 0;
    let touchPanStartOffsetX = 0;
    let touchPanStartOffsetY = 0;

    function getTouchDistance(touch1: Touch, touch2: Touch) {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchStart(event: TouchEvent) {
      event.preventDefault();
      activeTouches = Array.from(event.touches);

      if (activeTouches.length === 2) {
        lastPinchDistance = getTouchDistance(
          activeTouches[0],
          activeTouches[1],
        );
        const canvasRect = canvas.getBoundingClientRect();
        lastPinchMidX =
          (activeTouches[0].clientX + activeTouches[1].clientX) / 2 -
          canvasRect.left;
        lastPinchMidY =
          (activeTouches[0].clientY + activeTouches[1].clientY) / 2 -
          canvasRect.top;
      } else if (activeTouches.length === 1) {
        isTouchPanActive = true;
        touchPanStartX = activeTouches[0].clientX;
        touchPanStartY = activeTouches[0].clientY;
        touchPanStartOffsetX = canvasTransformRef.current.offsetX;
        touchPanStartOffsetY = canvasTransformRef.current.offsetY;
      }
    }

    function handleTouchMove(event: TouchEvent) {
      event.preventDefault();
      const touches = Array.from(event.touches);

      if (touches.length === 2) {
        const { scale, offsetX, offsetY } = canvasTransformRef.current;
        const distance = getTouchDistance(touches[0], touches[1]);
        const canvasRect = canvas.getBoundingClientRect();
        const midX =
          (touches[0].clientX + touches[1].clientX) / 2 - canvasRect.left;
        const midY =
          (touches[0].clientY + touches[1].clientY) / 2 - canvasRect.top;

        const zoomFactor = distance / lastPinchDistance;
        const newScale = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, scale * zoomFactor),
        );
        const scaleRatio = newScale / scale;
        const newOffsetX = midX - (midX - offsetX) * scaleRatio;
        const newOffsetY = midY - (midY - offsetY) * scaleRatio;

        const panDx = midX - lastPinchMidX;
        const panDy = midY - lastPinchMidY;

        canvasTransformRef.current = {
          scale: newScale,
          offsetX: newOffsetX + panDx,
          offsetY: newOffsetY + panDy,
        };
        shouldRedrawRef.current = true;

        lastPinchDistance = distance;
        lastPinchMidX = midX;
        lastPinchMidY = midY;
      } else if (touches.length === 1 && isTouchPanActive) {
        const dx = touches[0].clientX - touchPanStartX;
        const dy = touches[0].clientY - touchPanStartY;
        canvasTransformRef.current.offsetX = touchPanStartOffsetX + dx;
        canvasTransformRef.current.offsetY = touchPanStartOffsetY + dy;
        shouldRedrawRef.current = true;
      }
    }

    function handleTouchEnd(event: TouchEvent) {
      activeTouches = Array.from(event.touches);
      if (activeTouches.length < 2) {
        lastPinchDistance = 0;
      }
      if (activeTouches.length === 0) {
        isTouchPanActive = false;
      }
      if (activeTouches.length === 1) {
        isTouchPanActive = true;
        touchPanStartX = activeTouches[0].clientX;
        touchPanStartY = activeTouches[0].clientY;
        touchPanStartOffsetX = canvasTransformRef.current.offsetX;
        touchPanStartOffsetY = canvasTransformRef.current.offsetY;
      }
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveNative);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveNative);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [localSubgraph]);

  if (!localSubgraph) return null;

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
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          position: 'relative',
          marginBottom: '16px',
        }}
        className="graph-mini-container"
      >
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
      </div>
    </div>
  );
}
