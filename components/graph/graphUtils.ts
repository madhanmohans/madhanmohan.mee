import type { MutableRefObject } from 'react';
import {
  CENTER_STRENGTH,
  CHARGE_STRENGTH,
  COLLIDE_RADIUS,
  LINK_DISTANCE,
  LINK_STRENGTH,
} from './constants';
import type { ForceGraphInstance, Graph, Link, Node } from './types';

// Force-graph libraries replace link endpoints with node objects once the
// simulation runs, so an endpoint may be either an id or a node.
export function getLinkEndpointId(endpoint: Link['source']): string {
  return typeof endpoint === 'object'
    ? (endpoint.id as string)
    : (endpoint as string);
}

export function createForceGraphRef<T extends ForceGraphInstance>(
  graphRef: MutableRefObject<T | undefined>,
  onInit?: (instance: T) => void,
) {
  return {
    get current() {
      return graphRef.current;
    },
    set current(instance: T | undefined) {
      graphRef.current = instance;
      if (instance) onInit?.(instance);
    },
  };
}

// d3-force and d3-force-3d share this API, so each view passes its own
interface ForceFactories {
  forceLink: () => any;
  forceManyBody: () => any;
  forceCenter: () => any;
  forceCollide: (radius: number) => any;
}

export function configureGraphForces(
  forceGraphInstance: ForceGraphInstance,
  { forceLink, forceManyBody, forceCenter, forceCollide }: ForceFactories,
) {
  forceGraphInstance.d3Force(
    'link',
    forceLink().distance(LINK_DISTANCE).strength(LINK_STRENGTH),
  );
  forceGraphInstance.d3Force(
    'charge',
    forceManyBody().strength(CHARGE_STRENGTH),
  );
  forceGraphInstance.d3Force('center', forceCenter().strength(CENTER_STRENGTH));
  forceGraphInstance.d3Force('collision', forceCollide(COLLIDE_RADIUS));
}

export function enrichGraphNodesWithNeighbors(graph: Graph): {
  nodes: Node[];
  links: Link[];
} {
  const { nodes, links } = structuredClone(graph);
  for (const node of nodes) {
    node.neighbors = links.flatMap((link: any) => {
      if (link.source === node.id) return link.target as string;
      if (link.target === node.id) return link.source as string;
      return [];
    });
  }
  return { nodes, links };
}

// A node lights up when it is hovered or is a neighbour of the hovered node
export function isNodeHighlighted(node: any, hoveredNode: any): boolean {
  return (
    hoveredNode?.id === node.id ||
    (hoveredNode?.neighbors &&
      typeof node.id === 'string' &&
      hoveredNode.neighbors.includes(node.id))
  );
}

export function isLinkHighlighted(link: any, hoveredNode: any): boolean {
  return (
    !!hoveredNode &&
    typeof link.source === 'object' &&
    typeof link.target === 'object' &&
    (hoveredNode.id === link.source.id || hoveredNode.id === link.target.id)
  );
}
