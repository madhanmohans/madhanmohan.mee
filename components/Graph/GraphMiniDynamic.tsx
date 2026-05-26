'use client';

import dynamic from 'next/dynamic';
import { GraphMiniProps } from './GraphShared';

const GraphMiniInner = dynamic(() => import('./GraphMini').then((m) => m.GraphMini), {
  ssr: false,
  loading: () => <div className="h-[200px]" />,
});

export function GraphMini(props: GraphMiniProps) {
  return <GraphMiniInner {...props} />;
}
