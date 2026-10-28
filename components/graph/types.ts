export interface Graph {
  links: Link[];
  nodes: Node[];
}

export interface Node {
  id?: string | number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number;
  fy?: number;
  fz?: number;
  [others: string]: any;
}

export interface Link {
  source?: string | number | Node;
  target?: string | number | Node;
  [others: string]: any;
}

export interface GraphViewProps {
  foregroundGraph?: Graph;
  backgroundGraph?: boolean;
}

export interface TooltipState {
  x: number;
  y: number;
  title: string;
  content: string;
}

export type ForceGraphInstance = any;
