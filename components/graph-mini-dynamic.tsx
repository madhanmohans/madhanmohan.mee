'use client';

import dynamic from 'next/dynamic';
import type { GraphMiniProps } from './graph-mini';

const GraphMiniInner = dynamic(() => import('./graph-mini').then((m) => m.GraphMini), {
  ssr: false,
  loading: () => <div className="h-[200px]" />,
});

export function GraphMini(props: GraphMiniProps) {
  return <GraphMiniInner {...props} />;
}
