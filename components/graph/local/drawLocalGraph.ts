import type { CanvasTransform, LocalGraphNode, SimulationLink } from './types';

const MAX_LABEL_LENGTH = 16;

export interface LocalGraphColors {
  mutedForeground: string;
  activeNode: string;
  textForeground: string;
  linkStroke: string;
}

// Reads theme colors from CSS variables on the container
export function readLocalGraphColors(container: HTMLElement): LocalGraphColors {
  const computedStyles = getComputedStyle(container);
  const mutedForeground = computedStyles
    .getPropertyValue('--color-fd-muted-foreground')
    .trim();
  return {
    mutedForeground,
    activeNode: computedStyles.getPropertyValue('--color-fd-ring').trim(),
    textForeground: computedStyles.getPropertyValue('color').trim(),
    linkStroke: `color-mix(in oklab, ${mutedForeground} 40%, transparent)`,
  };
}

// Sizes stay constant on screen, so they are divided by the zoom scale
export function drawLocalGraph(
  context: CanvasRenderingContext2D,
  {
    nodes,
    links,
    transform: { scale, offsetX, offsetY },
    devicePixelRatio,
    width,
    height,
    colors,
  }: {
    nodes: LocalGraphNode[];
    links: SimulationLink[];
    transform: CanvasTransform;
    devicePixelRatio: number;
    width: number;
    height: number;
    colors: LocalGraphColors;
  },
) {
  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  context.clearRect(0, 0, width, height);

  context.setTransform(
    devicePixelRatio * scale,
    0,
    0,
    devicePixelRatio * scale,
    devicePixelRatio * offsetX,
    devicePixelRatio * offsetY,
  );

  context.strokeStyle = colors.linkStroke;
  context.lineWidth = 1 / scale;
  for (const link of links) {
    context.beginPath();
    context.moveTo(link.source.x, link.source.y);
    context.lineTo(link.target.x, link.target.y);
    context.stroke();
  }

  for (const node of nodes) {
    const radius = (node.isCurrent ? 5 : 3) / scale;

    context.beginPath();
    context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    context.fillStyle = node.isCurrent
      ? colors.activeNode
      : colors.mutedForeground;
    context.fill();

    const fontSize = (node.isCurrent ? 10 : 8) / scale;
    context.font = `${fontSize}px CommitMono, monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = node.isCurrent
      ? colors.textForeground
      : colors.mutedForeground;

    let label = node.text;
    if (label.length > MAX_LABEL_LENGTH) {
      label = label.slice(0, MAX_LABEL_LENGTH - 2) + '…';
    }
    context.fillText(label, node.x, node.y + radius + 3 / scale);
  }
}
