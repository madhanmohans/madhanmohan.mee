'use client';

import { useMemo, useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { createForceGraphRef } from '../graphUtils';
import type { ForceGraphInstance, Graph } from '../types';
import {
  ALPHA_DECAY,
  VELOCITY_DECAY,
  COOLDOWN_TIME,
  WARMUP_TICKS_BG,
} from '../constants';
import { configureForces3D } from './configureForces3D';

function startAutoRotate(forceGraphInstance: ForceGraphInstance) {
  const controls = forceGraphInstance.controls();
  if (!controls) return;
  controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches;
  controls.autoRotateSpeed = 0.3;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
}

// Slowly rotating, non-interactive 3D graph used as a page backdrop
export function BackgroundGraph3D({ graph }: { graph: Graph }) {
  const graphRef = useRef<ForceGraphInstance>(undefined);

  const clonedGraph = useMemo(() => {
    return structuredClone(graph);
  }, [graph]);

  return (
    <ForceGraph3D
      ref={createForceGraphRef(
        graphRef,
        (forceGraphInstance: ForceGraphInstance) => {
          configureForces3D(forceGraphInstance);
          startAutoRotate(forceGraphInstance);
        },
      )}
      graphData={clonedGraph}
      nodeColor={() => '#fff'}
      linkColor={() => '#fff'}
      linkOpacity={0.2}
      linkWidth={0.5}
      nodeVal={3}
      enableNodeDrag={false}
      enableNavigationControls={false}
      d3AlphaDecay={ALPHA_DECAY}
      d3VelocityDecay={VELOCITY_DECAY}
      cooldownTime={COOLDOWN_TIME}
      warmupTicks={WARMUP_TICKS_BG}
      showNavInfo={false}
      backgroundColor="#000000"
    />
  );
}
