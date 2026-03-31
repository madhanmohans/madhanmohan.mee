'use client';
import React, { lazy, type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import type {
  ForceGraphMethods,
  ForceGraphProps,
  LinkObject,
  NodeObject,
} from 'react-force-graph-2d';
import { forceCollide, forceCenter, forceLink, forceManyBody } from 'd3-force';
import { useRouter } from 'fumadocs-core/framework';
import { AnimatePresence, motion } from 'framer-motion';

export interface Graph {
  links: Link[];
  nodes: Node[];
}

export type Node = NodeObject<NodeType>;
export type Link = LinkObject<NodeType, LinkType>;

export interface NodeType {
  text: string;
  description?: string;
  content?: string;
  neighbors?: string[];
  url: string;
}

export type LinkType = Record<string, unknown>;

export interface GraphViewProps {
  graph?: Graph;
  /** Ghost mode: no interactivity, no labels, muted — used as a background layer */
  ghost?: boolean;
}

const ForceGraph2D = lazy(
  () => import('react-force-graph-2d'),
) as typeof import('react-force-graph-2d').default;

/** Minimal markdown renderer for the hover tooltip */
function MiniMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip dividers and empty lines between sections (collapse multiple blank lines)
    if (/^---+$/.test(line.trim())) continue;

    // Heading: ## Title or # Title
    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      const text = headingMatch[1]
        .replace(/==\*?([^=]+)==\*?/g, '$1') // strip ==highlight==
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1');
      elements.push(
        <p key={i} className="font-semibold text-fd-foreground mt-1.5 first:mt-0 text-[11px] uppercase tracking-wider opacity-60">
          {text}
        </p>
      );
      continue;
    }

    // List item: - text or * text or → text
    const listMatch = line.match(/^[-*→]\s+(.+)/);
    if (listMatch) {
      const raw = listMatch[1]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
        .replace(/\[\[([^\]]+)\]\]/g, '$1')       // [[wikilink]] → text
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // **bold** → text
        .replace(/_{1,2}([^_]+)_{1,2}/g, '$1');  // _italic_ → text
      elements.push(
        <div key={i} className="flex gap-1 items-start leading-snug">
          <span className="opacity-40 shrink-0">·</span>
          <span>{raw}</span>
        </div>
      );
      continue;
    }

    // Plain text (non-empty)
    if (line.trim()) {
      const raw = line
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\[\[([^\]]+)\]\]/g, '$1')
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
        .replace(/_{1,2}([^_]+)_{1,2}/g, '$1');
      elements.push(
        <p key={i} className="leading-snug opacity-80">{raw}</p>
      );
    }
  }

  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

export function GraphView(props: GraphViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [graphData, setGraphData] = useState<Graph | null>(props.graph ?? null);

  useEffect(() => {
    setMount(true);
  }, []);

  // Fetch graph data from API if not provided as prop
  useEffect(() => {
    if (!props.graph) {
      fetch('/api/graph')
        .then((r) => r.json())
        .then((data: Graph) => setGraphData(data))
        .catch(() => {});
    }
  }, [props.graph]);

  if (props.ghost) {
    return (
      <div ref={ref} className="absolute inset-0 size-full overflow-hidden">
        {mount && graphData && (
          <GhostGraph graph={graphData} containerRef={ref} />
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative [&_canvas]:size-full rounded-xl overflow-hidden bg-fd-background"
      style={{
        boxShadow:
          '0 1px 2px rgba(17,24,39,0.04), 0 4px 8px rgba(17,24,39,0.02), 0 12px 24px rgba(17,24,39,0.015)',
      }}
    >
      <AnimatePresence>
        {mount && graphData && (
          <motion.div
            className="size-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
          >
            <InteractiveGraph {...props} graph={graphData} containerRef={ref} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Ghost graph — no labels, no interaction, just nodes + links as a background texture */
function GhostGraph({
  containerRef,
  graph,
}: { graph: Graph; containerRef: RefObject<HTMLDivElement | null> }) {
  const graphRef = useRef<ForceGraphMethods<Node, Link> | undefined>(undefined);

  const enrichedNodes = useMemo(() => {
    const { nodes, links } = structuredClone(graph);
    return { nodes, links };
  }, [graph]);

  const nodeCanvasObject: ForceGraphProps['nodeCanvasObject'] = (node, ctx) => {
    const container = containerRef.current;
    if (!container) return;
    const style = getComputedStyle(container);
    const radius = 3;
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = style.getPropertyValue('--color-fd-muted-foreground') || '#6b6b6b';
    ctx.fill();
  };

  const linkColor = () => {
    const container = containerRef.current;
    if (!container) return 'rgba(107,107,107,0.3)';
    const style = getComputedStyle(container);
    return `color-mix(in oklab, ${style.getPropertyValue('--color-fd-muted-foreground')} 30%, transparent)`;
  };

  return (
    <ForceGraph2D<NodeType, LinkType>
      ref={{
        get current() { return graphRef.current; },
        set current(fg) {
          graphRef.current = fg;
          if (fg) {
            fg.d3Force('link', forceLink().distance(30).strength(1));
            fg.d3Force('charge', forceManyBody().strength(1));
            fg.d3Force('center', forceCenter().strength(0.3));
            fg.d3Force('collision', forceCollide(40));
          }
        },
      }}
      graphData={enrichedNodes}
      nodeCanvasObject={nodeCanvasObject}
      linkColor={linkColor}
      linkWidth={1}
      enableNodeDrag={false}
      enableZoomInteraction={false}
      enablePanInteraction={false}
      d3AlphaDecay={0.0228}
      d3VelocityDecay={0.4}
      cooldownTime={4000}
      warmupTicks={50}
    />
  );
}

function InteractiveGraph({
  containerRef,
  graph,
}: GraphViewProps & { graph: Graph; containerRef: RefObject<HTMLDivElement | null> }) {
  const graphRef = useRef<ForceGraphMethods<Node, Link> | undefined>(undefined);
  const hoveredRef = useRef<Node | null>(null);
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    content: string;
  } | null>(null);

  const handleNodeHover = (node: Node | null) => {
    const fg = graphRef.current;
    if (!fg) return;
    hoveredRef.current = node;

    if (node) {
      const coords = fg.graph2ScreenCoords(node.x!, node.y!);
      setTooltip({
        x: coords.x + 4,
        y: coords.y + 4,
        title: node.text,
        content: node.content ?? node.description ?? '',
      });
    } else {
      setTooltip(null);
    }
  };

  const nodeCanvasObject: ForceGraphProps['nodeCanvasObject'] = (node, ctx) => {
    const container = containerRef.current;
    if (!container) return;
    const style = getComputedStyle(container);
    const fontSize = 14;
    const radius = 5;

    ctx.beginPath();
    ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);

    const hoverNode = hoveredRef.current;
    const isActive =
      hoverNode?.id === node.id ||
      hoverNode?.neighbors?.includes(node.id as string);

    ctx.fillStyle = isActive
      ? '#c0392b'
      : style.getPropertyValue('--color-fd-muted-foreground');
    ctx.fill();

    ctx.font = `${fontSize}px CommitMono, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = style.getPropertyValue('color');
    ctx.fillText(node.text, node.x!, node.y! + radius + fontSize);
  };

  const linkColor = (link: Link) => {
    const container = containerRef.current;
    if (!container) return '#999';
    const style = getComputedStyle(container);
    const hoverNode = hoveredRef.current;

    if (
      hoverNode &&
      typeof link.source === 'object' &&
      typeof link.target === 'object' &&
      (hoverNode.id === link.source.id || hoverNode.id === link.target.id)
    ) {
      return style.getPropertyValue('--color-fd-primary');
    }

    return `color-mix(in oklab, ${style.getPropertyValue('--color-fd-muted-foreground')} 50%, transparent)`;
  };

  const enrichedNodes = useMemo(() => {
    const { nodes, links } = structuredClone(graph);
    for (const node of nodes) {
      node.neighbors = links.flatMap((link) => {
        if (link.source === node.id) return link.target as string;
        if (link.target === node.id) return link.source as string;
        return [];
      });
    }
    return { nodes, links };
  }, [graph]);

  function zoomBy(factor: number) {
    const fg = graphRef.current;
    if (!fg) return;
    fg.zoom((fg.zoom() as number) * factor, 300);
  }

  function zoomFit() {
    graphRef.current?.zoomToFit(400, 60);
  }

  return (
    <>
      <ForceGraph2D<NodeType, LinkType>
        ref={{
          get current() { return graphRef.current; },
          set current(fg) {
            graphRef.current = fg;
            if (fg) {
              fg.d3Force('link', forceLink().distance(30).strength(1));
              fg.d3Force('charge', forceManyBody().strength(1));
              fg.d3Force('center', forceCenter().strength(0.3));
              fg.d3Force('collision', forceCollide(40));
            }
          },
        }}
        graphData={enrichedNodes}
        nodeCanvasObject={nodeCanvasObject}
        linkColor={linkColor}
        onNodeHover={handleNodeHover}
        onNodeClick={(node) => {
          router.push(node.url);
        }}
        linkWidth={2}
        enableNodeDrag
        enableZoomInteraction
        d3AlphaDecay={0.0228}
        d3VelocityDecay={0.4}
        cooldownTime={4000}
        warmupTicks={100}
      />

      {/* Zoom controls */}
      <div className="graph-zoom-controls">
        <button className="graph-zoom-btn" onClick={() => zoomBy(1.4)} title="Zoom in">+</button>
        <div className="graph-zoom-divider" />
        <button className="graph-zoom-btn" onClick={() => zoomBy(1 / 1.4)} title="Zoom out">−</button>
        <div className="graph-zoom-divider" />
        <button className="graph-zoom-btn graph-zoom-fit" onClick={zoomFit} title="Fit to view">⤢</button>
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
