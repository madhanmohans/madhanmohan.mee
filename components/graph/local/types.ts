export interface LocalGraphNode {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCurrent: boolean;
}

export interface LocalGraphLink {
  source: string;
  target: string;
}

export interface SimulationLink {
  source: LocalGraphNode;
  target: LocalGraphNode;
}

export interface CanvasTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}
