'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGraphData } from './useGraphData';
import type { Graph, GraphViewProps } from './types';

// Shared mount/fetch/fade-in wrapper for the 2D and 3D graph views. The
// background variant fills its parent; the interactive one fades in on load.
export function GraphViewShell({
  foregroundGraph,
  backgroundGraph,
  renderBackground,
  renderInteractive,
  frameStyle,
}: GraphViewProps & {
  renderBackground: (
    graph: Graph,
    container: HTMLDivElement,
  ) => React.ReactNode;
  renderInteractive: (
    graph: Graph,
    containerRef: RefObject<HTMLDivElement | null>,
  ) => React.ReactNode;
  frameStyle?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const fetchedGraphData = useGraphData(foregroundGraph);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (backgroundGraph) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 size-full overflow-hidden"
      >
        {isMounted &&
          fetchedGraphData &&
          containerRef.current &&
          renderBackground(fetchedGraphData, containerRef.current)}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden bg-fd-background"
      style={frameStyle}
    >
      <AnimatePresence>
        {isMounted && fetchedGraphData && (
          <motion.div
            className="size-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
          >
            {renderInteractive(fetchedGraphData, containerRef)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
