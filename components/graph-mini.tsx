'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Waypoints } from 'lucide-react';
import type { Graph } from '@/components/graph-view';

interface GraphMiniProps {
  /** The URL of the current page (e.g. "/docs/hooks") */
  pageUrl: string;
}

interface MiniNode {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCurrent: boolean;
}

interface MiniLink {
  source: string;
  target: string;
}

const GRAPH_HEIGHT = 200;
const HIT_RADIUS = 12;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 4;

/**
 * A small local‑graph preview that sits in the TOC sidebar.
 * Shows the current page and its direct neighbours using a lightweight canvas.
 * Supports pinch/scroll zoom and pan. Clicking a node navigates to that page.
 */
export function GraphMini({ pageUrl }: GraphMiniProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fullGraph, setFullGraph] = useState<Graph | null>(null);
  const router = useRouter();

  // Settled node positions for hit-testing
  const nodesRef = useRef<MiniNode[]>([]);

  // Zoom & pan state (kept in refs to avoid re-renders)
  const transformRef = useRef({ scale: 1, offsetX: 0, offsetY: 0 });
  // Flag to trigger re-draw after zoom/pan
  const needsRedrawRef = useRef(false);

  useEffect(() => {
    fetch('/api/graph')
      .then((r) => r.json())
      .then((data: Graph) => setFullGraph(data))
      .catch(() => {});
  }, []);

  // Build local subgraph: current page + direct neighbours
  const localData = useMemo(() => {
    if (!fullGraph) return null;

    const neighborIds = new Set<string>();
    neighborIds.add(pageUrl);

    for (const link of fullGraph.links) {
      const src = typeof link.source === 'object' ? (link.source as { id: string }).id : link.source as string;
      const tgt = typeof link.target === 'object' ? (link.target as { id: string }).id : link.target as string;
      if (src === pageUrl) neighborIds.add(tgt);
      if (tgt === pageUrl) neighborIds.add(src);
    }

    const nodes: MiniNode[] = fullGraph.nodes
      .filter((n) => neighborIds.has(n.id as string))
      .map((n) => ({
        id: n.id as string,
        text: n.text,
        x: 0, y: 0, vx: 0, vy: 0,
        isCurrent: n.id === pageUrl,
      }));

    if (nodes.length === 0) {
      nodes.push({
        id: pageUrl, text: 'Current',
        x: 0, y: 0, vx: 0, vy: 0,
        isCurrent: true,
      });
    }

    const links: MiniLink[] = fullGraph.links
      .filter((l) => {
        const src = typeof l.source === 'object' ? (l.source as { id: string }).id : l.source as string;
        const tgt = typeof l.target === 'object' ? (l.target as { id: string }).id : l.target as string;
        return neighborIds.has(src) && neighborIds.has(tgt);
      })
      .map((l) => ({
        source: typeof l.source === 'object' ? (l.source as { id: string }).id : l.source as string,
        target: typeof l.target === 'object' ? (l.target as { id: string }).id : l.target as string,
      }));

    return { nodes, links };
  }, [fullGraph, pageUrl]);

  // --- Transform helpers ---

  /** Convert screen-relative coordinates to graph-world coordinates */
  function screenToWorld(screenX: number, screenY: number) {
    const { scale, offsetX, offsetY } = transformRef.current;
    return {
      x: (screenX - offsetX) / scale,
      y: (screenY - offsetY) / scale,
    };
  }

  /** Convert mouse event to canvas-space coordinates (before zoom transform) */
  function getCanvasScreenCoords(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function findNodeAt(worldX: number, worldY: number): MiniNode | null {
    const { scale } = transformRef.current;
    const hitRadius = HIT_RADIUS / scale; // scale-compensated hit area
    for (const node of nodesRef.current) {
      const dx = node.x - worldX;
      const dy = node.y - worldY;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) return node;
    }
    return null;
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const screen = getCanvasScreenCoords(e);
    const world = screenToWorld(screen.x, screen.y);
    const node = findNodeAt(world.x, world.y);
    if (node) {
      e.preventDefault();
      router.push(node.id);
    }
  }

  function handleCanvasMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const screen = getCanvasScreenCoords(e);
    const world = screenToWorld(screen.x, screen.y);
    const node = findNodeAt(world.x, world.y);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = node ? 'pointer' : 'grab';
    }
  }

  // --- Force simulation + rendering with zoom/pan ---
  useEffect(() => {
    if (!localData || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = GRAPH_HEIGHT;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // Reset transform for this render
    transformRef.current = { scale: 1, offsetX: 0, offsetY: 0 };

    // Clone nodes for simulation
    const nodes = localData.nodes.map((n, i) => ({
      ...n,
      x: n.isCurrent ? w / 2 : w / 2 + (Math.cos(i * 2.4) * Math.min(w, h) * 0.3),
      y: n.isCurrent ? h / 2 : h / 2 + (Math.sin(i * 2.4) * Math.min(w, h) * 0.3),
      vx: 0,
      vy: 0,
    }));

    nodesRef.current = nodes;

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const links = localData.links
      .map((l) => ({ source: nodeMap.get(l.source), target: nodeMap.get(l.target) }))
      .filter((l): l is { source: MiniNode; target: MiniNode } => !!l.source && !!l.target);

    const style = getComputedStyle(container);
    const mutedColor = style.getPropertyValue('--color-fd-muted-foreground').trim() || '#6b6b6b';
    const textColor = style.getPropertyValue('color').trim() || '#ccc';
    const linkColorVal = `color-mix(in oklab, ${mutedColor} 40%, transparent)`;

    let frame: number;
    let tick = 0;
    const maxTicks = 120;

    function simulate() {
      for (const a of nodes) {
        a.vx += (w / 2 - a.x) * 0.005;
        a.vy += (h / 2 - a.y) * 0.005;
        for (const b of nodes) {
          if (a === b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 200 / (dist * dist);
          a.vx += (dx / dist) * force;
          a.vy += (dy / dist) * force;
        }
      }
      for (const link of links) {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 50;
        const force = (dist - targetDist) * 0.02;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        link.source.vx += fx;
        link.source.vy += fy;
        link.target.vx -= fx;
        link.target.vy -= fy;
      }
      for (const node of nodes) {
        node.vx *= 0.7;
        node.vy *= 0.7;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(20, Math.min(w - 20, node.x));
        node.y = Math.max(20, Math.min(h - 30, node.y));
      }
    }

    function draw() {
      const { scale, offsetX, offsetY } = transformRef.current;

      // Reset transform & clear
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Apply zoom/pan transform
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offsetX, dpr * offsetY);

      // Draw links
      ctx.strokeStyle = linkColorVal;
      ctx.lineWidth = 1 / scale;
      for (const link of links) {
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const radius = (node.isCurrent ? 5 : 3) / scale;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.isCurrent ? '#c0392b' : mutedColor;
        ctx.fill();

        // Label
        const fontSize = (node.isCurrent ? 10 : 8) / scale;
        ctx.font = `${fontSize}px CommitMono, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = node.isCurrent ? textColor : mutedColor;

        let label = node.text;
        if (label.length > 16) label = label.slice(0, 14) + '…';
        ctx.fillText(label, node.x, node.y + radius + 3 / scale);
      }
    }

    function loop() {
      if (tick < maxTicks) {
        simulate();
        tick++;
        draw();
      } else if (needsRedrawRef.current) {
        needsRedrawRef.current = false;
        draw();
      }
      frame = requestAnimationFrame(loop);
    }

    // --- Wheel zoom handler ---
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      e.stopPropagation();

      const { scale, offsetX, offsetY } = transformRef.current;
      const canvasRect = canvas.getBoundingClientRect();

      // Mouse position in canvas screen space
      const mx = e.clientX - canvasRect.left;
      const my = e.clientY - canvasRect.top;

      // Determine zoom factor
      const zoomFactor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale * zoomFactor));

      // Zoom toward cursor: adjust offset so the point under the cursor stays fixed
      const ratio = newScale / scale;
      const newOffsetX = mx - (mx - offsetX) * ratio;
      const newOffsetY = my - (my - offsetY) * ratio;

      transformRef.current = { scale: newScale, offsetX: newOffsetX, offsetY: newOffsetY };
      needsRedrawRef.current = true;
    }

    // --- Pan (drag) handler ---
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let panStartOffsetX = 0;
    let panStartOffsetY = 0;

    function handleMouseDown(e: MouseEvent) {
      // Only start pan if no node is under cursor
      const canvasRect = canvas.getBoundingClientRect();
      const sx = e.clientX - canvasRect.left;
      const sy = e.clientY - canvasRect.top;
      const world = {
        x: (sx - transformRef.current.offsetX) / transformRef.current.scale,
        y: (sy - transformRef.current.offsetY) / transformRef.current.scale,
      };
      let hitNode = false;
      for (const node of nodesRef.current) {
        const dx = node.x - world.x;
        const dy = node.y - world.y;
        const hitR = HIT_RADIUS / transformRef.current.scale;
        if (dx * dx + dy * dy <= hitR * hitR) { hitNode = true; break; }
      }
      if (hitNode) return;

      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panStartOffsetX = transformRef.current.offsetX;
      panStartOffsetY = transformRef.current.offsetY;
      canvas.style.cursor = 'grabbing';
    }

    function handleMouseMoveNative(e: MouseEvent) {
      if (!isPanning) return;
      const dx = e.clientX - panStartX;
      const dy = e.clientY - panStartY;
      transformRef.current.offsetX = panStartOffsetX + dx;
      transformRef.current.offsetY = panStartOffsetY + dy;
      needsRedrawRef.current = true;
    }

    function handleMouseUp() {
      if (isPanning) {
        isPanning = false;
        canvas.style.cursor = 'grab';
      }
    }

    // --- Touch pinch-zoom + pan handlers ---
    let activeTouches: Touch[] = [];
    let lastPinchDist = 0;
    let lastPinchMidX = 0;
    let lastPinchMidY = 0;
    let isTouchPanning = false;
    let touchPanStartX = 0;
    let touchPanStartY = 0;
    let touchPanStartOffsetX = 0;
    let touchPanStartOffsetY = 0;

    function getTouchDist(t1: Touch, t2: Touch) {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchStart(e: TouchEvent) {
      e.preventDefault();
      activeTouches = Array.from(e.touches);

      if (activeTouches.length === 2) {
        lastPinchDist = getTouchDist(activeTouches[0], activeTouches[1]);
        const canvasRect = canvas.getBoundingClientRect();
        lastPinchMidX = (activeTouches[0].clientX + activeTouches[1].clientX) / 2 - canvasRect.left;
        lastPinchMidY = (activeTouches[0].clientY + activeTouches[1].clientY) / 2 - canvasRect.top;
      } else if (activeTouches.length === 1) {
        isTouchPanning = true;
        touchPanStartX = activeTouches[0].clientX;
        touchPanStartY = activeTouches[0].clientY;
        touchPanStartOffsetX = transformRef.current.offsetX;
        touchPanStartOffsetY = transformRef.current.offsetY;
      }
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();
      const touches = Array.from(e.touches);

      if (touches.length === 2) {
        const { scale, offsetX, offsetY } = transformRef.current;
        const dist = getTouchDist(touches[0], touches[1]);
        const canvasRect = canvas.getBoundingClientRect();
        const midX = (touches[0].clientX + touches[1].clientX) / 2 - canvasRect.left;
        const midY = (touches[0].clientY + touches[1].clientY) / 2 - canvasRect.top;

        // Pinch zoom
        const zoomFactor = dist / lastPinchDist;
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale * zoomFactor));
        const ratio = newScale / scale;
        const newOffsetX = midX - (midX - offsetX) * ratio;
        const newOffsetY = midY - (midY - offsetY) * ratio;

        // Pan with midpoint movement
        const panDx = midX - lastPinchMidX;
        const panDy = midY - lastPinchMidY;

        transformRef.current = {
          scale: newScale,
          offsetX: newOffsetX + panDx,
          offsetY: newOffsetY + panDy,
        };
        needsRedrawRef.current = true;

        lastPinchDist = dist;
        lastPinchMidX = midX;
        lastPinchMidY = midY;
      } else if (touches.length === 1 && isTouchPanning) {
        const dx = touches[0].clientX - touchPanStartX;
        const dy = touches[0].clientY - touchPanStartY;
        transformRef.current.offsetX = touchPanStartOffsetX + dx;
        transformRef.current.offsetY = touchPanStartOffsetY + dy;
        needsRedrawRef.current = true;
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      activeTouches = Array.from(e.touches);
      if (activeTouches.length < 2) {
        lastPinchDist = 0;
      }
      if (activeTouches.length === 0) {
        isTouchPanning = false;
      }
      // Reset single-finger pan origin when going from 2 fingers to 1
      if (activeTouches.length === 1) {
        isTouchPanning = true;
        touchPanStartX = activeTouches[0].clientX;
        touchPanStartY = activeTouches[0].clientY;
        touchPanStartOffsetX = transformRef.current.offsetX;
        touchPanStartOffsetY = transformRef.current.offsetY;
      }
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveNative);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    loop();

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveNative);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [localData]);

  if (!localData) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Header with label + "open graph view" icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '0 0 8px 0',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.04em',
            color: 'var(--color-fd-muted-foreground)',
            margin: 0,
            fontFamily: "'CommitMono', monospace",
          }}
        >
          local graph
        </p>
        <Link
          href="/second-brain"
          aria-label="Open graph view"
          className="graph-mini-open-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            color: 'var(--color-fd-muted-foreground)',
            transition: 'color 0.15s ease, background 0.15s ease',
            textDecoration: 'none',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.color = 'var(--color-fd-primary)';
            el.style.background = 'var(--color-fd-accent)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.color = 'var(--color-fd-muted-foreground)';
            el.style.background = 'transparent';
          }}
        >
          <Waypoints size={14} />
          <span
            className="graph-mini-tooltip"
            style={{
              position: 'absolute',
              right: 'calc(100% + 6px)',
              top: '50%',
              transform: 'translateY(-50%)',
              whiteSpace: 'nowrap',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.01em',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'var(--color-fd-popover)',
              color: 'var(--color-fd-popover-foreground)',
              border: '1px solid var(--color-fd-border)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.15s ease',
              fontFamily: "'CommitMono', monospace",
            }}
          >
            Open graph view
          </span>
        </Link>
      </div>

      {/* Graph canvas */}
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
