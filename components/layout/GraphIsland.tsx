'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { BrainCircuit, Box, Notebook, Square, Waypoints } from 'lucide-react';
import { NOTES_BASE_URL } from '@/app/constants';

export const GRAPH_DIMENSIONS = ['2d', '3d'] as const;
export type GraphDimension = (typeof GRAPH_DIMENSIONS)[number];

const DIMENSION_ICONS: Record<GraphDimension, LucideIcon> = {
  '2d': Square,
  '3d': Box,
};

// Bar geometry: the top edge dips into a notch that cradles the home button
const WIDTH = 340;
const HEIGHT = 60;
const RADIUS = 22;
const NOTCH_DEPTH = 36;
const C = WIDTH / 2;
const BAR_PATH = [
  `M ${RADIUS} 0`,
  `H ${C - 58}`,
  `C ${C - 38} 0 ${C - 34} ${NOTCH_DEPTH} ${C} ${NOTCH_DEPTH}`,
  `C ${C + 34} ${NOTCH_DEPTH} ${C + 38} 0 ${C + 58} 0`,
  `H ${WIDTH - RADIUS}`,
  `A ${RADIUS} ${RADIUS} 0 0 1 ${WIDTH} ${RADIUS}`,
  `V ${HEIGHT - RADIUS}`,
  `A ${RADIUS} ${RADIUS} 0 0 1 ${WIDTH - RADIUS} ${HEIGHT}`,
  `H ${RADIUS}`,
  `A ${RADIUS} ${RADIUS} 0 0 1 0 ${HEIGHT - RADIUS}`,
  `V ${RADIUS}`,
  `A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} 0`,
  'Z',
].join(' ');

function IslandButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="graph-island-btn"
      data-active={active}
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={16} strokeWidth={active ? 2.25 : 1.75} />
      <span>{label}</span>
    </button>
  );
}

// Floating bottom-center bar for the graph page: dimension switch on the
// left, home in the raised center button, graph/notes views on the right
export function GraphIsland({
  dimension,
  onDimensionChange,
}: {
  dimension: GraphDimension;
  onDimensionChange: (dimension: GraphDimension) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="graph-island" aria-label="Graph controls">
      <svg
        className="graph-island-bar"
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
      >
        <path d={BAR_PATH} />
      </svg>

      <div className="graph-island-items">
        <div className="graph-island-group">
          {GRAPH_DIMENSIONS.map((d) => (
            <IslandButton
              key={d}
              icon={DIMENSION_ICONS[d]}
              label={d}
              active={dimension === d}
              onClick={() => onDimensionChange(d)}
            />
          ))}
        </div>

        <div className="graph-island-group" data-tour="view-toggle">
          <IslandButton
            icon={Waypoints}
            label="graph"
            active={pathname === '/graph'}
            onClick={() => router.push('/graph')}
          />
          <IslandButton
            icon={Notebook}
            label="notes"
            active={pathname === NOTES_BASE_URL}
            onClick={() => router.push(NOTES_BASE_URL)}
          />
        </div>
      </div>

      <Link
        href="/"
        className="graph-island-home"
        aria-label="Home"
        data-tour="home-link"
      >
        <BrainCircuit size={20} />
      </Link>
    </nav>
  );
}
