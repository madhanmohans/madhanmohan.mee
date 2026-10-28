import { HIT_RADIUS } from '../constants';
import type { CanvasTransform, LocalGraphNode } from './types';

export function screenToWorld(
  { scale, offsetX, offsetY }: CanvasTransform,
  screenX: number,
  screenY: number,
) {
  return {
    x: (screenX - offsetX) / scale,
    y: (screenY - offsetY) / scale,
  };
}

// Hit radius stays constant on screen regardless of zoom level
export function findNodeAt(
  nodes: LocalGraphNode[],
  { scale }: CanvasTransform,
  worldX: number,
  worldY: number,
): LocalGraphNode | null {
  const scaleCompensatedHitRadius = HIT_RADIUS / scale;
  for (const node of nodes) {
    const dx = node.x - worldX;
    const dy = node.y - worldY;
    if (
      dx * dx + dy * dy <=
      scaleCompensatedHitRadius * scaleCompensatedHitRadius
    )
      return node;
  }
  return null;
}

// Rescales around a fixed screen point so that point stays under the cursor
export function zoomAroundPoint(
  { scale, offsetX, offsetY }: CanvasTransform,
  newScale: number,
  pointX: number,
  pointY: number,
): CanvasTransform {
  const scaleRatio = newScale / scale;
  return {
    scale: newScale,
    offsetX: pointX - (pointX - offsetX) * scaleRatio,
    offsetY: pointY - (pointY - offsetY) * scaleRatio,
  };
}
