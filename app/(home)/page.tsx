import Link from 'next/link';
import { GraphView } from '@/components/graph-view';
import { buildGraph } from '@/lib/build-graph';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <p>
        open{' '}
        <Link href="/docs" className="font-medium underline">
          /docs
        </Link>{' '}
        to see my notes.
      </p>
      <GraphView graph={buildGraph()} />
    </div>
  );
}
