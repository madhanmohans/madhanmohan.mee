'use client';
import dynamic from 'next/dynamic';
import type { GraphViewProps } from './graph-shared';
export type { Graph, Node, Link, NodeType, LinkType, GraphViewProps } from './graph-shared';

function LoadingFallback() {
  return <div className="size-full rounded-xl bg-fd-background" />;
}

const GraphView2D = dynamic(() => import('./graph-view-2d'), {
  ssr: false,
  loading: LoadingFallback,
});

const GraphView3D = dynamic(() => import('./graph-view-3d'), {
  ssr: false,
  loading: LoadingFallback,
});

export function GraphView(props: GraphViewProps & { dimension?: '2d' | '3d' }) {
  const { dimension = '3d', ...rest } = props;

  return dimension === '2d' ? (
    <GraphView2D {...rest} />
  ) : (
    <GraphView3D {...rest} />
  );
}
