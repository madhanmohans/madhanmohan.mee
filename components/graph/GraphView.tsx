'use client';
import dynamic from 'next/dynamic';
import { GraphFramePlaceholder } from './GraphFrame';
import type { GraphViewProps } from './types';
export type { Graph, Node, Link } from './types';

function BackgroundLoadingFallback() {
  return <div className="size-full" />;
}

// Background and interactive variants share each chunk but need different
// placeholders: the interactive one holds the framed space until it mounts
const GraphView2D = dynamic(() => import('./2d/GraphView2D'), {
  ssr: false,
  loading: () => <GraphFramePlaceholder />,
});

const BackgroundGraphView2D = dynamic(() => import('./2d/GraphView2D'), {
  ssr: false,
  loading: BackgroundLoadingFallback,
});

const GraphView3D = dynamic(() => import('./3d/GraphView3D'), {
  ssr: false,
  loading: () => <GraphFramePlaceholder withShadow={false} />,
});

const BackgroundGraphView3D = dynamic(() => import('./3d/GraphView3D'), {
  ssr: false,
  loading: BackgroundLoadingFallback,
});

// Full knowledge graph, rendered in 3D by default
export function GraphView(props: GraphViewProps & { dimension?: '2d' | '3d' }) {
  const { dimension = '3d', ...rest } = props;

  if (rest.backgroundGraph) {
    return dimension === '2d' ? (
      <BackgroundGraphView2D {...rest} />
    ) : (
      <BackgroundGraphView3D {...rest} />
    );
  }

  return dimension === '2d' ? (
    <GraphView2D {...rest} />
  ) : (
    <GraphView3D {...rest} />
  );
}
