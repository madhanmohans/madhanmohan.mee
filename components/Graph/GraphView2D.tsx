'use client';

import {
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { forceCollide, forceCenter, forceLink, forceManyBody } from 'd3-force';
import { useRouter } from 'fumadocs-core/framework';
import { AnimatePresence, motion } from 'framer-motion';
import type { Graph, GraphViewProps } from './GraphShared';
import {
  MiniMarkdown,
  createForceGraphRef,
  enrichGraphNodesWithNeighbors,
} from './GraphShared';
import type { ForceGraphInstance } from './GraphShared';
import {
  TWO_D_GRAPH_NODE_RADIUS,
  LINK_DISTANCE,
  LINK_STRENGTH,
  CHARGE_STRENGTH,
  CENTER_STRENGTH,
  COLLIDE_RADIUS,
  ALPHA_DECAY,
  VELOCITY_DECAY,
  COOLDOWN_TIME,
  WARMUP_TICKS_BG,
  WARMUP_TICKS,
  DEFAULT_LINK_COLOR,
  HIGHLIGHT_COLOR,
  LABEL_FONT_SIZE,
  LINK_WIDTH_BG,
  LINK_WIDTH,
  ZOOM_FACTOR,
  ZOOM_ANIMATION_DURATION,
  ZOOM_TO_FIT_DURATION,
  ZOOM_TO_FIT_PADDING,
  TOOLTIP_ANIMATION_DURATION,
  TOOLTIP_OFFSET,
} from './constants';

function configureGraphForces(forceGraphInstance: ForceGraphInstance) {
  forceGraphInstance.d3Force('link', forceLink().distance(LINK_DISTANCE).strength(LINK_STRENGTH));
  forceGraphInstance.d3Force('charge', forceManyBody().strength(CHARGE_STRENGTH));
  forceGraphInstance.d3Force('center', forceCenter().strength(CENTER_STRENGTH));
  forceGraphInstance.d3Force('collision', forceCollide(COLLIDE_RADIUS));
}

function GraphBackground({
  container,
  graph,
}: {
  graph: Graph; 
  container: HTMLDivElement;
}) {
    const computedStyles = getComputedStyle(container);
    const mutedForegroundColor = computedStyles.getPropertyValue('--color-fd-muted-foreground').trim();
    const graphRef = useRef<ForceGraphInstance>(undefined);

  const clonedGraph = useMemo(() => {
    return structuredClone(graph);
  }, [graph]);

  const drawNodeOnCanvas = (node: any, context: CanvasRenderingContext2D) => {
    if (!container) return;
    context.beginPath();
    context.arc(node.x!, node.y!, TWO_D_GRAPH_NODE_RADIUS, 0, 2 * Math.PI, false);
    context.fillStyle = mutedForegroundColor
    context.fill();
  };

  const resolveLinkColor = () => {
    if (!container) return DEFAULT_LINK_COLOR;
    return `color-mix(in oklab, ${mutedForegroundColor} 30%, transparent)`;
  };

  return (
    <ForceGraph2D
      ref={createForceGraphRef(graphRef, configureGraphForces)}
      graphData={clonedGraph}
      nodeCanvasObject={drawNodeOnCanvas}
      linkColor={resolveLinkColor}
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

function InteractiveGraph({
  containerRef,
  foregroundGraph: graph,
}: GraphViewProps & {
  graph: Graph;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
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
      const screenCoordinates = forceGraphInstance.graph2ScreenCoords(
        hoveredNode.x,
        hoveredNode.y,
      );
      setTooltip({
        x: screenCoordinates.x + TOOLTIP_OFFSET,
        y: screenCoordinates.y + TOOLTIP_OFFSET,
        title: hoveredNode.text,
        content: hoveredNode.content ?? hoveredNode.description ?? '',
      });
    } else {
      setTooltip(null);
    }
  };

  const drawNodeOnCanvas = (node: any, context: CanvasRenderingContext2D) => {
    if (!containerRef.current) return;
    const computedStyles = getComputedStyle(containerRef.current);
    const mutedForegroundColor = computedStyles.getPropertyValue('--color-fd-muted-foreground').trim();
    context.beginPath();
    context.arc(node.x!, node.y!, TWO_D_GRAPH_NODE_RADIUS, 0, 2 * Math.PI, false);

    const hoveredNode = hoveredNodeRef.current;
    const isActive =
      hoveredNode?.id === node.id ||
      (hoveredNode?.neighbors &&
        typeof node.id === 'string' &&
        hoveredNode.neighbors.includes(node.id));

    context.fillStyle = isActive
      ? HIGHLIGHT_COLOR
      : mutedForegroundColor;
    context.fill();

    context.font = `${LABEL_FONT_SIZE}px CommitMono, monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = computedStyles.getPropertyValue('color');
    context.fillText(node.text, node.x!, node.y! + TWO_D_GRAPH_NODE_RADIUS + LABEL_FONT_SIZE);
  };

  const resolveLinkColor = (link: any) => {
    const containerElement = containerRef.current;
    if (!containerElement) return DEFAULT_LINK_COLOR;
    const computedStyles = getComputedStyle(containerElement);
    const hoveredNode = hoveredNodeRef.current;

    if (
      hoveredNode &&
      typeof link.source === 'object' &&
      typeof link.target === 'object' &&
      (hoveredNode.id === link.source.id || hoveredNode.id === link.target.id)
    ) {
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

  function zoomToFitView() {
    graphRef.current?.zoomToFit(ZOOM_TO_FIT_DURATION, ZOOM_TO_FIT_PADDING);
  }

  return (
    <>
      <ForceGraph2D
        ref={createForceGraphRef(graphRef, configureGraphForces)}
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

      <div className="graph-zoom-controls">
        <button
          className="graph-zoom-btn"
          onClick={() => zoomByFactor(ZOOM_FACTOR)}
          title="Zoom in"
        >
          +
        </button>
        <div className="graph-zoom-divider" />
        <button
          className="graph-zoom-btn"
          onClick={() => zoomByFactor(1 / ZOOM_FACTOR)}
          title="Zoom out"
        >
          −
        </button>
        <div className="graph-zoom-divider" />
        <button
          className="graph-zoom-btn graph-zoom-fit"
          onClick={zoomToFitView}
          title="Fit to view"
        >
          ⤢
        </button>
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
            transition={{ duration: TOOLTIP_ANIMATION_DURATION, ease: 'easeOut' }}
          >
            <p className="font-semibold text-fd-foreground text-[12px] mb-2 border-b border-fd-border pb-1.5">
              {tooltip.title}
            </p>
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

export default function GraphView2D(props: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const container = containerRef.current;
  const [isMounted, setIsMounted] = useState(false);
  const [fetchedGraphData, setFetchedGraphData] = useState<Graph | null>(
    props.foregroundGraph ?? null,
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!props.foregroundGraph) {
      fetch('/api/graph')
        .then((response) => response.json())
        .then((data: Graph) => setFetchedGraphData(data))
        .catch(() => { });
    }
  }, [props.foregroundGraph]);

  if (props.backgroundGraph) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 size-full overflow-hidden"
      >
        {isMounted && fetchedGraphData && (
          <GraphBackground graph={fetchedGraphData} container={containerRef.current} />
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
            <InteractiveGraph
              {...props}
              foregroundGraph={fetchedGraphData}
              containerRef={containerRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
