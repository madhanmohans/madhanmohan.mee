import type { LocalGraphNode, SimulationLink } from './types';

const CENTER_PULL = 0.005;
const REPULSION = 200;
const LINK_TARGET_DISTANCE = 50;
const LINK_SPRING = 0.02;
const VELOCITY_DAMPING = 0.7;
const EDGE_PADDING = 20;
const BOTTOM_PADDING = 30;

// Current page in the centre, neighbours fanned out on a golden-angle spiral
export function seedNodePositions(
  nodes: LocalGraphNode[],
  width: number,
  height: number,
): LocalGraphNode[] {
  const radius = Math.min(width, height) * 0.3;
  return nodes.map((node, index) => ({
    ...node,
    x: node.isCurrent ? width / 2 : width / 2 + Math.cos(index * 2.4) * radius,
    y: node.isCurrent
      ? height / 2
      : height / 2 + Math.sin(index * 2.4) * radius,
    vx: 0,
    vy: 0,
  }));
}

// One tick of a tiny force simulation: centre pull, node repulsion and
// link springs, with positions clamped to the canvas
export function stepSimulation(
  nodes: LocalGraphNode[],
  links: SimulationLink[],
  width: number,
  height: number,
) {
  for (const nodeA of nodes) {
    nodeA.vx += (width / 2 - nodeA.x) * CENTER_PULL;
    nodeA.vy += (height / 2 - nodeA.y) * CENTER_PULL;
    for (const nodeB of nodes) {
      if (nodeA === nodeB) continue;
      const dx = nodeA.x - nodeB.x;
      const dy = nodeA.y - nodeB.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = REPULSION / (dist * dist);
      nodeA.vx += (dx / dist) * force;
      nodeA.vy += (dy / dist) * force;
    }
  }
  for (const link of links) {
    const dx = link.target.x - link.source.x;
    const dy = link.target.y - link.source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (dist - LINK_TARGET_DISTANCE) * LINK_SPRING;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    link.source.vx += fx;
    link.source.vy += fy;
    link.target.vx -= fx;
    link.target.vy -= fy;
  }
  for (const node of nodes) {
    node.vx *= VELOCITY_DAMPING;
    node.vy *= VELOCITY_DAMPING;
    node.x += node.vx;
    node.y += node.vy;
    node.x = Math.max(EDGE_PADDING, Math.min(width - EDGE_PADDING, node.x));
    node.y = Math.max(EDGE_PADDING, Math.min(height - BOTTOM_PADDING, node.y));
  }
}
