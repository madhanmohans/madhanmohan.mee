import { getLinkEndpointId } from '../graphUtils';
import type { Graph } from '../types';
import type { LocalGraphLink, LocalGraphNode } from './types';

function createNode(id: string, text: string, isCurrent: boolean) {
  return { id, text, x: 0, y: 0, vx: 0, vy: 0, isCurrent };
}

// The current page plus its direct neighbours and the links between them
export function buildLocalSubgraph(
  graph: Graph,
  pageUrl: string,
): { nodes: LocalGraphNode[]; links: LocalGraphLink[] } {
  const allLinks: LocalGraphLink[] = graph.links.map((link) => ({
    source: getLinkEndpointId(link.source),
    target: getLinkEndpointId(link.target),
  }));

  const connectedNodeIds = new Set<string>([pageUrl]);
  for (const { source, target } of allLinks) {
    if (source === pageUrl) connectedNodeIds.add(target);
    if (target === pageUrl) connectedNodeIds.add(source);
  }

  const nodes: LocalGraphNode[] = graph.nodes
    .filter((node) => connectedNodeIds.has(node.id as string))
    .map((node) =>
      createNode(node.id as string, node.text, node.id === pageUrl),
    );

  if (nodes.length === 0) {
    nodes.push(createNode(pageUrl, 'Current', true));
  }

  const links = allLinks.filter(
    ({ source, target }) =>
      connectedNodeIds.has(source) && connectedNodeIds.has(target),
  );

  return { nodes, links };
}
