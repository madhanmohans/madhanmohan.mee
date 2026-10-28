declare module 'd3-force-3d' {
  export * from 'd3-force';
  // The z-axis twin of forceX/forceY, which d3-force has no type for
  export function forceZ<NodeDatum extends { z?: number }>(
    z?: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number),
  ): import('d3-force').ForceY<any>;
}
