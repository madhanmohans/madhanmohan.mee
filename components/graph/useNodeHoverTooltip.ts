'use client';

import { type MutableRefObject, useRef, useState } from 'react';
import { TOOLTIP_OFFSET } from './constants';
import type { ForceGraphInstance, TooltipState } from './types';

// Tracks the hovered node and positions a tooltip next to it. The caller
// supplies how to project a node into screen space (2D vs 3D).
export function useNodeHoverTooltip(
  graphRef: MutableRefObject<ForceGraphInstance | undefined>,
  toScreenCoords: (
    graph: ForceGraphInstance,
    node: any,
  ) => { x: number; y: number },
) {
  const hoveredNodeRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleNodeHover = (hoveredNode: any) => {
    const forceGraphInstance = graphRef.current;
    if (!forceGraphInstance) return;
    hoveredNodeRef.current = hoveredNode;

    if (hoveredNode) {
      const screenCoordinates = toScreenCoords(forceGraphInstance, hoveredNode);
      setTooltip({
        x: screenCoordinates.x + TOOLTIP_OFFSET,
        y: screenCoordinates.y + TOOLTIP_OFFSET,
        title: hoveredNode.text,
        content: hoveredNode.content ?? hoveredNode.description ?? '',
      });
    } else {
      setTooltip(null);
    }
  };

  return { tooltip, hoveredNodeRef, handleNodeHover };
}
