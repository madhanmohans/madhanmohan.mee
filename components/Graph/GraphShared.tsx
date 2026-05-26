'use client';
import React from 'react';
import { type MutableRefObject } from 'react';

export interface Graph {
  links: Link[];
  nodes: Node[];
}

export interface NodeObject<T = Record<string, unknown>> {
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

export interface NodeType {
  text: string;
  description?: string;
  content?: string;
  neighbors?: string[];
  url: string;
}

export type Node = NodeObject<NodeType>;

export interface LinkObject<NodeType = Record<string, unknown>, LinkType = Record<string, unknown>> {
  source?: string | number | NodeObject<NodeType>;
  target?: string | number | NodeObject<NodeType>;
  [others: string]: any;
}

export type Link = LinkObject<NodeType, Record<string, unknown>>;

export type LinkType = Record<string, unknown>;

export interface GraphViewProps {
  graph?: Graph;
  ghost?: boolean;
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
        <p key={i} className="font-semibold text-fd-foreground mt-1.5 first:mt-0 text-[11px] uppercase tracking-wider opacity-60">
          {text}
        </p>
      );
      continue;
    }

    const listMatch = line.match(/^[-*→]\s+(.+)/);
    if (listMatch) {
      elements.push(
        <div key={i} className="flex gap-1 items-start leading-snug">
          <span className="opacity-40 shrink-0">·</span>
          <span>{stripInlineMarkdown(listMatch[1])}</span>
        </div>
      );
      continue;
    }

    if (line.trim()) {
      elements.push(
        <p key={i} className="leading-snug opacity-80">{stripInlineMarkdown(line)}</p>
      );
    }
  }

  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

export type ForceGraphInstance = any;

export function createForceGraphRef<T extends ForceGraphInstance>(
  graphRef: MutableRefObject<T | undefined>,
  onInit?: (instance: T) => void,
) {
  return {
    get current() { return graphRef.current; },
    set current(instance: T | undefined) {
      graphRef.current = instance;
      if (instance) onInit?.(instance);
    },
  };
}

export function enrichGraphNodesWithNeighbors(graph: Graph): { nodes: Node[]; links: Link[] } {
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
