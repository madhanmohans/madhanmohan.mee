'use client';
import React, { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import ForceGraph3D from 'react-force-graph-3d';
import { forceCollide, forceCenter, forceLink, forceManyBody } from 'd3-force-3d';
import { useRouter } from 'fumadocs-core/framework';
import { AnimatePresence, motion } from 'framer-motion';
import type { Graph, GraphViewProps } from './GraphShared';
import { MiniMarkdown, createForceGraphRef, enrichGraphNodesWithNeighbors } from './GraphShared';
import type { ForceGraphInstance } from './GraphShared';

function parseColorNumber(style: CSSStyleDeclaration, name: string, fallback: string): number {
  const element = document.createElement('div');
  element.style.color = style.getPropertyValue(name).trim() || fallback;
  element.style.display = 'none';
  document.body.appendChild(element);
  const rgb = getComputedStyle(element).color;
  document.body.removeChild(element);
  const parsedColorNo = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return parsedColorNo ? (parseInt(parsedColorNo[1]) << 16) | (parseInt(parsedColorNo[2]) << 8) | parseInt(parsedColorNo[3]) : 0x6b6b6b;
}

function parseColorString(style: CSSStyleDeclaration, name: string, fallback: string): string {
  const raw = style.getPropertyValue(name).trim() || fallback;
  const hex = raw.match(/^#([A-Fa-f\d]{6})([A-Fa-f\d]{2})$/);
  if (hex) return '#' + hex[1];
  const parsedColorStr = raw.match(/^rgba?\(\s*([^,\s)]+)\s*[,/]\s*([^,\s)]+)\s*[,/]\s*([^,\s)]+)/);
  return parsedColorStr ? `rgb(${parsedColorStr[1]}, ${parsedColorStr[2]}, ${parsedColorStr[3]})` : raw;
}

function makeTextSprite(text: string, color: string, fontSize: number, opacity = 1) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const font = `${fontSize}px Arial, sans-serif`;
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = metrics.width;
  const padding = 12;
  const width = textWidth + padding * 2;
  const height = fontSize * 2.8;
  canvas.width = width;
  canvas.height = height;

  context.font = font;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    sizeAttenuation: true,
    opacity,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(width / 10, height / 10, 1);
  return sprite;
}

function configureGraphForces(forceGraphInstance: ForceGraphInstance) {
  forceGraphInstance.d3Force('link', forceLink().distance(30).strength(1));
  forceGraphInstance.d3Force('charge', forceManyBody().strength(1));
  forceGraphInstance.d3Force('center', forceCenter().strength(0.3));
  forceGraphInstance.d3Force('collision', forceCollide(40));
}

function GhostGraph({
  containerRef,
  graph,
}: { graph: Graph; containerRef: RefObject<HTMLDivElement | null> }) {
  const graphRef = useRef<ForceGraphInstance>(undefined);

  const clonedGraph = useMemo(() => {
    return structuredClone(graph);
  }, [graph]);

  return (
    <ForceGraph3D
      ref={createForceGraphRef(graphRef, (forceGraphInstance: Graph) => {
        configureGraphForces(forceGraphInstance);
        const controls = forceGraphInstance.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.3;
          controls.enableDamping = true;
          controls.dampingFactor = 0.1;
        }
      })}
      graphData={clonedGraph}
      nodeColor={() => '#6b6b6b'}
      linkColor={() => '#6b6b6b'}
      linkOpacity={0.2}
      linkWidth={0.5}
      nodeVal={3}
      enableNodeDrag={false}
      enableNavigationControls={false}
      d3AlphaDecay={0.0228}
      d3VelocityDecay={0.4}
      cooldownTime={4000}
      warmupTicks={50}
      showNavInfo={false}
      backgroundColor="#000000"
    />
  );
}

function InteractiveGraph({
  containerRef,
  graph,
}: GraphViewProps & { graph: Graph; containerRef: RefObject<HTMLDivElement | null> }) {
  const graphRef = useRef<ForceGraphInstance>(undefined);
  const hoveredNodeRef = useRef<any>(null);
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    content: string;
  } | null>(null);

  const handleNodeHover = (hoveredNode: any) => {
    const forceGraphInstance = graphRef.current;
    if (!forceGraphInstance) return;
    hoveredNodeRef.current = hoveredNode;

    if (hoveredNode) {
      const screenCoordinates = forceGraphInstance.graph2ScreenCoords(hoveredNode.x, hoveredNode.y, hoveredNode.z);
      setTooltip({
        x: screenCoordinates.x + 4,
        y: screenCoordinates.y + 4,
        title: hoveredNode.text,
        content: hoveredNode.content ?? hoveredNode.description ?? '',
      });
    } else {
      setTooltip(null);
    }
  };

  const createNodeThreeObject = (node: any) => {
    const containerElement = containerRef.current;
    if (!containerElement) return new THREE.Mesh();

    const computedStyles = getComputedStyle(containerElement);
    const mutedForegroundColor = parseColorString(computedStyles, '--color-fd-muted-foreground', '#6b6b6b');
    const textForegroundColor = computedStyles.getPropertyValue('color').trim() || '#ccc';

    const hoveredNode = hoveredNodeRef.current;
    const isActive =
      hoveredNode?.id === node.id ||
      (hoveredNode?.neighbors && typeof node.id === 'string' && hoveredNode.neighbors.includes(node.id));

    const color = isActive ? 0xc0392b : parseColorNumber(computedStyles, '--color-fd-muted-foreground', '#6b6b6b');
    const sphereRadius = isActive ? 6 : 4;

    const group = new THREE.Group();

    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: isActive || !hoveredNode ? 1 : 0.3,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);

    let label = node.text;
    if (label.length > 24) label = label.slice(0, 22) + '…';
    const labelOpacity = isActive || !hoveredNode ? 1 : 0.35;
    const labelSprite = makeTextSprite(label, mutedForegroundColor, 16, labelOpacity);
    labelSprite.position.y = sphereRadius + 5;
    group.add(labelSprite);

    return group;
  };

  const resolveLinkColor = (link: any) => {
    const containerElement = containerRef.current;
    if (!containerElement) return '#999999';
    const computedStyles = getComputedStyle(containerElement);
    const hoveredNode = hoveredNodeRef.current;

    const isActive =
      hoveredNode &&
      typeof link.source === 'object' &&
      typeof link.target === 'object' &&
      (hoveredNode.id === link.source.id || hoveredNode.id === link.target.id);

    if (isActive) {
      return '#c0392b';
    }

    return parseColorString(computedStyles, '--color-fd-muted-foreground', '#999999');
  };

  const resolveLinkWidth = (link: any) => {
    const hoveredNode = hoveredNodeRef.current;
    if (
      hoveredNode &&
      typeof link.source === 'object' &&
      typeof link.target === 'object' &&
      (hoveredNode.id === link.source.id || hoveredNode.id === link.target.id)
    ) {
      return 4;
    }
    return 1;
  };

  const graphDataWithNeighbors = useMemo(() => {
    return enrichGraphNodesWithNeighbors(graph);
  }, [graph]);

  function zoomToFitView() {
    graphRef.current?.zoomToFit(400, 60);
  }

  return (
    <>
      <ForceGraph3D
        ref={createForceGraphRef(graphRef, configureGraphForces)}
        graphData={graphDataWithNeighbors}
        nodeThreeObject={createNodeThreeObject}
        linkColor={resolveLinkColor}
        linkWidth={resolveLinkWidth}
        linkOpacity={0.5}
        onNodeHover={handleNodeHover}
        onNodeClick={(clickedNode: any) => {
          router.push(clickedNode.url);
        }}
        enableNodeDrag
        enableNavigationControls
        d3AlphaDecay={0.0228}
        d3VelocityDecay={0.4}
        cooldownTime={4000}
        warmupTicks={100}
        showNavInfo={false}
        backgroundColor="rgba(0,0,0,0)"
      />

      <div className="graph-zoom-controls">
        <button className="graph-zoom-btn graph-zoom-fit" onClick={zoomToFitView} title="Fit to view">⤢</button>
      </div>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            key="tooltip"
            className="absolute text-fd-popover-foreground p-3 border border-fd-border rounded-lg pointer-events-none w-64 overflow-hidden"
            style={{
              top: tooltip.y,
              left: tooltip.x,
              background: 'var(--color-fd-popover)',
              fontFamily: "'CommitMono', monospace",
              fontSize: '11px',
              letterSpacing: '0.01em',
              boxShadow:
                '0 1px 2px rgba(17,24,39,0.06), 0 4px 8px rgba(17,24,39,0.04), 0 12px 24px rgba(17,24,39,0.03)',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          >
            <p className="font-semibold text-fd-foreground text-[12px] mb-2 border-b border-fd-border pb-1.5">{tooltip.title}</p>
            {tooltip.content && (
              <div className="text-fd-muted-foreground max-h-48 overflow-y-auto">
                <MiniMarkdown content={tooltip.content} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function GraphView3D(props: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [fetchedGraphData, setFetchedGraphData] = useState<Graph | null>(props.graph ?? null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!props.graph) {
      fetch('/api/graph')
        .then((response) => response.json())
        .then((data: Graph) => setFetchedGraphData(data))
        .catch(() => {});
    }
  }, [props.graph]);

  if (props.ghost) {
    return (
      <div ref={containerRef} className="absolute inset-0 size-full overflow-hidden">
        {isMounted && fetchedGraphData && (
          <GhostGraph graph={fetchedGraphData} containerRef={containerRef} />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden bg-fd-background"
      style={{
        boxShadow:
          '0 1px 2px rgba(17,24,39,0.04), 0 4px 8px rgba(17,24,39,0.02), 0 12px 24px rgba(17,24,39,0.015)',
      }}
    >
      <AnimatePresence>
        {isMounted && fetchedGraphData && (
          <motion.div
            className="size-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
          >
            <InteractiveGraph {...props} graph={fetchedGraphData} containerRef={containerRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
