'use client';
import React, { type MutableRefObject, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GRAPH_API_URL, TOOLTIP_ANIMATION_DURATION } from './constants';

export interface Graph {
  links: Link[];
  nodes: Node[];
}

export interface Node {
  id?: string | number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number;
  fy?: number;
  fz?: number;
  [others: string]: any;
}

export interface Link {
  source?: string | number | Node;
  target?: string | number | Node;
  [others: string]: any;
}

export interface GraphViewProps {
  foregroundGraph?: Graph;
  backgroundGraph?: boolean;
}

export interface GraphMiniProps {
  pageUrl: string;
}

export interface MiniNode {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCurrent: boolean;
}

export interface MiniLink {
  source: string;
  target: string;
}

// Force-graph libraries replace link endpoints with node objects once the
// simulation runs, so an endpoint may be either an id or a node.
export function getLinkEndpointId(endpoint: Link['source']): string {
  return typeof endpoint === 'object'
    ? (endpoint.id as string)
    : (endpoint as string);
}

// Uses the given graph when present, otherwise fetches it from the API.
export function useGraphData(initialGraph?: Graph): Graph | null {
  const [fetchedGraph, setFetchedGraph] = useState<Graph | null>(null);

  useEffect(() => {
    if (initialGraph) return;
    fetch(GRAPH_API_URL)
      .then((response) => response.json())
      .then((data: Graph) => setFetchedGraph(data))
      .catch(() => {});
  }, [initialGraph]);

  return initialGraph ?? fetchedGraph;
}

export function stripInlineMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1');
}

export function MiniMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^---+$/.test(line.trim())) continue;

    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      const text = headingMatch[1]
        .replace(/==\*?([^=]+)==\*?/g, '$1')
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1');
      elements.push(
        <p
          key={i}
          className="font-semibold text-fd-foreground mt-1.5 first:mt-0 text-[11px] uppercase tracking-wider opacity-60"
        >
          {text}
        </p>,
      );
      continue;
    }

    const listMatch = line.match(/^[-*→]\s+(.+)/);
    if (listMatch) {
      elements.push(
        <div key={i} className="flex gap-1 items-start leading-snug">
          <span className="opacity-40 shrink-0">·</span>
          <span>{stripInlineMarkdown(listMatch[1])}</span>
        </div>,
      );
      continue;
    }

    if (line.trim()) {
      elements.push(
        <p key={i} className="leading-snug opacity-80">
          {stripInlineMarkdown(line)}
        </p>,
      );
    }
  }

  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

export interface TooltipState {
  x: number;
  y: number;
  title: string;
  content: string;
}

export function GraphTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  return (
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
          transition={{
            duration: TOOLTIP_ANIMATION_DURATION,
            ease: 'easeOut',
          }}
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
  );
}

export type ForceGraphInstance = any;

export function createForceGraphRef<T extends ForceGraphInstance>(
  graphRef: MutableRefObject<T | undefined>,
  onInit?: (instance: T) => void,
) {
  return {
    get current() {
      return graphRef.current;
    },
    set current(instance: T | undefined) {
      graphRef.current = instance;
      if (instance) onInit?.(instance);
    },
  };
}

export function enrichGraphNodesWithNeighbors(graph: Graph): {
  nodes: Node[];
  links: Link[];
} {
  const { nodes, links } = structuredClone(graph);
  for (const node of nodes) {
    node.neighbors = links.flatMap((link: any) => {
      if (link.source === node.id) return link.target as string;
      if (link.target === node.id) return link.source as string;
      return [];
    });
  }
  return { nodes, links };
}
