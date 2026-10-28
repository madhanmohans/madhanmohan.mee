'use client';
import dynamic from 'next/dynamic';
import type { GraphViewProps } from './types';
export type { Graph, Node, Link } from './types';

function LoadingFallback() {
  return <div className="size-full rounded-xl bg-fd-background" />;
}

const GraphView2D = dynamic(() => import('./2d/GraphView2D'), {
  ssr: false,
  loading: LoadingFallback,
});

const GraphView3D = dynamic(() => import('./3d/GraphView3D'), {
  ssr: false,
  loading: LoadingFallback,
});

// Full knowledge graph, rendered in 3D by default
export function GraphView(props: GraphViewProps & { dimension?: '2d' | '3d' }) {
  const { dimension = '3d', ...rest } = props;

  return dimension === '2d' ? (
    <GraphView2D {...rest} />
  ) : (
    <GraphView3D {...rest} />
  );
}
