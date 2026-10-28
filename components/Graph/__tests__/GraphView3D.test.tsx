import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useImperativeHandle } from 'react';
import * as THREE from 'three';

const mockPush = vi.fn();
const mockFetch = vi.fn();
const graphProps: any[] = [];

const controls = {
  autoRotate: false,
  autoRotateSpeed: 0,
  enableDamping: false,
  dampingFactor: 0,
};

const forceGraphInstance = {
  d3Force: vi.fn(),
  graph2ScreenCoords: vi.fn(() => ({ x: 10, y: 20 })),
  zoomToFit: vi.fn(),
  controls: vi.fn((): typeof controls | undefined => controls),
};

vi.stubGlobal('fetch', mockFetch);

vi.mock('fumadocs-core/framework', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('react-force-graph-3d', () => ({
  default: function ForceGraph3DMock(props: any) {
    graphProps.push(props);
    useImperativeHandle(props.ref, () => forceGraphInstance, []);
    return React.createElement('div', { 'data-testid': 'force-graph-3d' });
  },
}));

let cssVariables: Record<string, string>;
let resolvedColor: string;

const lastProps = () => graphProps[graphProps.length - 1];

const graph = {
  nodes: [
    { id: 'a', text: 'A', url: '/column/a', content: 'some **content**' },
    { id: 'b', text: 'B', url: '/column/b', description: 'desc' },
    { id: 'c', text: 'C', url: '/column/c' },
  ],
  links: [{ source: 'a', target: 'b' }],
};

async function renderGraph(props: Record<string, unknown>) {
  const { default: GraphView3D } =
    await import('@/components/Graph/GraphView3D');
  const result = render(React.createElement(GraphView3D, props));
  await vi.waitFor(() => {
    expect(screen.getByTestId('force-graph-3d')).toBeInTheDocument();
  });
  return result;
}

function sphereOf(group: THREE.Group) {
  return group.children[0] as THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshBasicMaterial
  >;
}

function labelOf(group: THREE.Group) {
  return group.children[1] as THREE.Sprite;
}

describe('GraphView3D', () => {
  const fillText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    graphProps.length = 0;
    cssVariables = {
      '--color-fd-muted-foreground': '#11223344',
      '--color-fd-ring': 'red',
    };
    resolvedColor = 'rgb(17, 34, 51)';
    vi.spyOn(window, 'getComputedStyle').mockImplementation(
      () =>
        ({
          getPropertyValue: (name: string) => cssVariables[name] ?? '',
          get color() {
            return resolvedColor;
          },
        }) as CSSStyleDeclaration,
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () =>
        ({
          measureText: () => ({ width: 40 }),
          fillText,
        }) as unknown as CanvasRenderingContext2D,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('interactive graph', () => {
    it('configures d3 forces when the instance is attached', async () => {
      await renderGraph({ foregroundGraph: graph });
      const forceNames = forceGraphInstance.d3Force.mock.calls.map(
        (call) => call[0],
      );
      expect(forceNames).toEqual(['link', 'charge', 'center', 'collision']);
    });

    it('fetches graph data when no foreground graph is given', async () => {
      mockFetch.mockResolvedValue({ json: () => Promise.resolve(graph) });
      await renderGraph({});
      expect(mockFetch).toHaveBeenCalledWith('/api/graph');
    });

    it('ignores fetch failures', async () => {
      mockFetch.mockRejectedValue(new Error('network'));
      const { default: GraphView3D } =
        await import('@/components/Graph/GraphView3D');
      render(React.createElement(GraphView3D, {}));
      await vi.waitFor(() => expect(mockFetch).toHaveBeenCalled());
      expect(screen.queryByTestId('force-graph-3d')).not.toBeInTheDocument();
    });

    it('navigates to the node url on click', async () => {
      await renderGraph({ foregroundGraph: graph });
      lastProps().onNodeClick({ url: '/column/b' });
      expect(mockPush).toHaveBeenCalledWith('/column/b');
    });

    it('shows a tooltip on hover using 3D screen coordinates', async () => {
      await renderGraph({ foregroundGraph: graph });

      act(() =>
        lastProps().onNodeHover({ ...graph.nodes[0], x: 1, y: 2, z: 3 }),
      );
      expect(forceGraphInstance.graph2ScreenCoords).toHaveBeenCalledWith(
        1,
        2,
        3,
      );
      expect(screen.getByText('some content')).toBeInTheDocument();

      act(() => lastProps().onNodeHover(graph.nodes[1]));
      expect(screen.getByText('desc')).toBeInTheDocument();

      act(() => lastProps().onNodeHover(graph.nodes[2]));
      expect(screen.getByText('C').nextElementSibling).toBeNull();

      act(() => lastProps().onNodeHover(null));
      await vi.waitFor(() => {
        expect(screen.queryByText('C')).not.toBeInTheDocument();
      });
    });

    it('ignores hover before the instance is attached', async () => {
      await renderGraph({ foregroundGraph: graph });
      lastProps().ref.current = undefined;
      act(() => lastProps().onNodeHover(graph.nodes[0]));
      expect(screen.queryByText('some content')).not.toBeInTheDocument();
    });

    it('builds idle node objects with a muted sphere and label', async () => {
      await renderGraph({ foregroundGraph: graph });

      const group = lastProps().nodeThreeObject({ id: 'a', text: 'A' });
      expect(group).toBeInstanceOf(THREE.Group);

      const sphere = sphereOf(group);
      expect(sphere.geometry.parameters.radius).toBe(3);
      expect(sphere.material.color.getHex()).toBe(0x112233);
      expect(sphere.material.opacity).toBe(1);
      expect(labelOf(group).material.opacity).toBe(1);
      expect(fillText).toHaveBeenCalledWith(
        'A',
        expect.any(Number),
        expect.any(Number),
      );
    });

    it('enlarges and highlights the hovered node and its neighbors, dimming others', async () => {
      await renderGraph({ foregroundGraph: graph });
      const enrichedNodeA = lastProps().graphData.nodes[0];
      act(() => lastProps().onNodeHover(enrichedNodeA));

      for (const id of ['a', 'b']) {
        const group = lastProps().nodeThreeObject({ id, text: id });
        expect(sphereOf(group).geometry.parameters.radius).toBe(5);
        expect(sphereOf(group).material.color.getHex()).toBe(0xc0392b);
      }

      const dimmed = lastProps().nodeThreeObject({ id: 'c', text: 'c' });
      expect(sphereOf(dimmed).material.opacity).toBe(0.3);
      expect(labelOf(dimmed).material.opacity).toBe(0.35);
    });

    it('truncates long labels', async () => {
      await renderGraph({ foregroundGraph: graph });
      lastProps().nodeThreeObject({ id: 'x', text: 'x'.repeat(30) });
      expect(fillText).toHaveBeenCalledWith(
        'x'.repeat(22) + '…',
        expect.any(Number),
        expect.any(Number),
      );
    });

    it('falls back to a default color when the resolved color is not rgb', async () => {
      resolvedColor = 'transparent';
      await renderGraph({ foregroundGraph: graph });
      const group = lastProps().nodeThreeObject({ id: 'a', text: 'A' });
      expect(sphereOf(group).material.color.getHex()).toBe(0x6b6b6b);
    });

    it('normalizes muted link colors from hex, rgb and raw values', async () => {
      await renderGraph({ foregroundGraph: graph });
      const link = { source: 'a', target: 'b' };

      expect(lastProps().linkColor(link)).toBe('#112233');

      cssVariables['--color-fd-muted-foreground'] = 'rgba(1, 2, 3, 0.5)';
      expect(lastProps().linkColor(link)).toBe('rgb(1, 2, 3)');

      cssVariables['--color-fd-muted-foreground'] = 'rgb(4 5 6)';
      expect(lastProps().linkColor(link)).toBe('rgb(4 5 6)');

      cssVariables['--color-fd-muted-foreground'] = 'oklch(0.5 0 0)';
      expect(lastProps().linkColor(link)).toBe('oklch(0.5 0 0)');

      delete cssVariables['--color-fd-muted-foreground'];
      expect(lastProps().linkColor(link)).toBe('#999999');
    });

    it('highlights and widens links touching the hovered node', async () => {
      await renderGraph({ foregroundGraph: graph });
      const linkAB = { source: { id: 'a' }, target: { id: 'b' } };
      const linkBC = { source: { id: 'b' }, target: { id: 'c' } };

      expect(lastProps().linkWidth(linkAB)).toBe(1);

      act(() => lastProps().onNodeHover({ id: 'a', text: 'A' }));
      expect(lastProps().linkColor(linkAB)).toBe('red');
      expect(lastProps().linkWidth(linkAB)).toBe(4);
      expect(lastProps().linkColor(linkBC)).toBe('#112233');
      expect(lastProps().linkWidth(linkBC)).toBe(1);
    });

    it('zooms to fit with the control button', async () => {
      await renderGraph({ foregroundGraph: graph });
      fireEvent.click(screen.getByTitle('Fit to view'));
      expect(forceGraphInstance.zoomToFit).toHaveBeenCalledWith(400, 60);
    });

    it('returns placeholder objects after the container unmounts', async () => {
      const { unmount } = await renderGraph({ foregroundGraph: graph });
      const { nodeThreeObject, linkColor } = lastProps();
      unmount();

      expect(nodeThreeObject({ id: 'a', text: 'A' })).toBeInstanceOf(
        THREE.Mesh,
      );
      expect(linkColor({})).toBe('#999999');
    });
  });

  describe('ghost background graph', () => {
    it('renders a non-interactive auto-rotating graph', async () => {
      await renderGraph({ foregroundGraph: graph, backgroundGraph: true });
      const props = lastProps();

      expect(props.enableNodeDrag).toBe(false);
      expect(props.enableNavigationControls).toBe(false);
      expect(props.nodeColor()).toBe('#fff');
      expect(props.linkColor()).toBe('#fff');
      expect(props.graphData).toEqual(graph);
      expect(props.graphData).not.toBe(graph);
      expect(controls).toMatchObject({
        autoRotate: true,
        autoRotateSpeed: 0.3,
        enableDamping: true,
        dampingFactor: 0.1,
      });
    });

    it('tolerates a missing controls object', async () => {
      forceGraphInstance.controls.mockReturnValueOnce(undefined);
      await renderGraph({ foregroundGraph: graph, backgroundGraph: true });
      expect(forceGraphInstance.d3Force).toHaveBeenCalled();
    });
  });
});
