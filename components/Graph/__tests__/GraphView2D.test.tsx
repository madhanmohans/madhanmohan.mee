import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useImperativeHandle } from 'react';
import {
  HIGHLIGHT_COLOR,
  DEFAULT_LINK_COLOR,
  ZOOM_FACTOR,
  ZOOM_ANIMATION_DURATION,
  ZOOM_TO_FIT_DURATION,
  ZOOM_TO_FIT_PADDING,
  TOOLTIP_OFFSET,
} from '@/components/Graph/constants';

const mockPush = vi.fn();
const mockFetch = vi.fn();
const graphProps: any[] = [];

const forceGraphInstance = {
  d3Force: vi.fn(),
  graph2ScreenCoords: vi.fn(() => ({ x: 10, y: 20 })),
  zoom: vi.fn((value?: number) => (value === undefined ? 2 : undefined)),
  zoomToFit: vi.fn(),
};

vi.stubGlobal('fetch', mockFetch);

vi.mock('fumadocs-core/framework', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('react-force-graph-2d', () => ({
  default: function ForceGraph2DMock(props: any) {
    graphProps.push(props);
    useImperativeHandle(props.ref, () => forceGraphInstance, []);
    return React.createElement('div', { 'data-testid': 'force-graph-2d' });
  },
}));

const cssVariables: Record<string, string> = {
  '--color-fd-muted-foreground': ' gray ',
  '--color-fd-primary': 'blue',
  color: 'black',
};

function createCanvasContext() {
  return {
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillText: vi.fn(),
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
  } as unknown as CanvasRenderingContext2D & Record<string, any>;
}

const graph = {
  nodes: [
    { id: 'a', text: 'A', url: '/note/a', content: '# Heading\n- item' },
    { id: 'b', text: 'B', url: '/note/b', description: 'desc' },
    { id: 'c', text: 'C', url: '/note/c' },
  ],
  links: [{ source: 'a', target: 'b' }],
};

const lastProps = () => graphProps[graphProps.length - 1];

async function renderGraph(props: Record<string, unknown>) {
  const { default: GraphView2D } =
    await import('@/components/Graph/GraphView2D');
  const result = render(React.createElement(GraphView2D, props));
  await vi.waitFor(() => {
    expect(screen.getByTestId('force-graph-2d')).toBeInTheDocument();
  });
  return result;
}

describe('GraphView2D', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    graphProps.length = 0;
    vi.spyOn(window, 'getComputedStyle').mockImplementation(
      () =>
        ({
          getPropertyValue: (name: string) => cssVariables[name] ?? '',
        }) as CSSStyleDeclaration,
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

    it('passes graph data enriched with neighbors', async () => {
      await renderGraph({ foregroundGraph: graph });
      const nodeA = lastProps().graphData.nodes.find((n: any) => n.id === 'a');
      expect(nodeA.neighbors).toEqual(['b']);
    });

    it('fetches graph data when no foreground graph is given', async () => {
      mockFetch.mockResolvedValue({ json: () => Promise.resolve(graph) });
      await renderGraph({});
      expect(mockFetch).toHaveBeenCalledWith('/api/graph');
    });

    it('ignores fetch failures', async () => {
      mockFetch.mockRejectedValue(new Error('network'));
      const { default: GraphView2D } =
        await import('@/components/Graph/GraphView2D');
      render(React.createElement(GraphView2D, {}));
      await vi.waitFor(() => expect(mockFetch).toHaveBeenCalled());
      expect(screen.queryByTestId('force-graph-2d')).not.toBeInTheDocument();
    });

    it('navigates to the node url on click', async () => {
      await renderGraph({ foregroundGraph: graph });
      lastProps().onNodeClick({ url: '/note/a' });
      expect(mockPush).toHaveBeenCalledWith('/note/a');
    });

    it('shows a tooltip with content on hover and hides it on leave', async () => {
      await renderGraph({ foregroundGraph: graph });

      act(() => lastProps().onNodeHover(graph.nodes[0]));
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('item')).toBeInTheDocument();
      const tooltip = screen.getByText('A').parentElement!;
      expect(tooltip.style.top).toBe(`${20 + TOOLTIP_OFFSET}px`);
      expect(tooltip.style.left).toBe(`${10 + TOOLTIP_OFFSET}px`);

      act(() => lastProps().onNodeHover(null));
      await vi.waitFor(() => {
        expect(screen.queryByText('Heading')).not.toBeInTheDocument();
      });
    });

    it('falls back to the description, then to no content, in the tooltip', async () => {
      await renderGraph({ foregroundGraph: graph });

      act(() => lastProps().onNodeHover(graph.nodes[1]));
      expect(screen.getByText('desc')).toBeInTheDocument();

      act(() => lastProps().onNodeHover(graph.nodes[2]));
      const title = screen.getByText('C');
      expect(title.nextElementSibling).toBeNull();
    });

    it('draws nodes highlighted when hovered or neighboring', async () => {
      await renderGraph({ foregroundGraph: graph });
      const enrichedNodeA = lastProps().graphData.nodes[0];

      const idleContext = createCanvasContext();
      lastProps().nodeCanvasObject(
        { id: 'a', text: 'A', x: 1, y: 2 },
        idleContext,
      );
      expect(idleContext.fillStyle).toBe('black');
      expect(idleContext.fill).toHaveBeenCalled();
      expect(idleContext.fillText).toHaveBeenCalledWith(
        'A',
        1,
        expect.any(Number),
      );

      act(() => lastProps().onNodeHover(enrichedNodeA));

      const fillStyles: unknown[] = [];
      const hoveredContext = createCanvasContext();
      hoveredContext.fill = vi.fn(() =>
        fillStyles.push(hoveredContext.fillStyle),
      );
      lastProps().nodeCanvasObject(
        { id: 'a', text: 'A', x: 0, y: 0 },
        hoveredContext,
      );
      lastProps().nodeCanvasObject(
        { id: 'b', text: 'B', x: 0, y: 0 },
        hoveredContext,
      );
      lastProps().nodeCanvasObject(
        { id: 'c', text: 'C', x: 0, y: 0 },
        hoveredContext,
      );
      expect(fillStyles).toEqual([HIGHLIGHT_COLOR, HIGHLIGHT_COLOR, 'gray']);
    });

    it('colors links touching the hovered node with the primary color', async () => {
      await renderGraph({ foregroundGraph: graph });
      const linkAB = { source: { id: 'a' }, target: { id: 'b' } };
      const linkBC = { source: { id: 'b' }, target: { id: 'c' } };

      expect(lastProps().linkColor(linkAB)).toContain('color-mix');

      act(() => lastProps().onNodeHover({ id: 'a', text: 'A' }));
      expect(lastProps().linkColor(linkAB)).toBe('blue');
      expect(lastProps().linkColor(linkBC)).toContain('color-mix');
      expect(lastProps().linkColor({ source: 'a', target: 'b' })).toContain(
        'color-mix',
      );
    });

    it('zooms in, out and to fit using the control buttons', async () => {
      await renderGraph({ foregroundGraph: graph });

      fireEvent.click(screen.getByTitle('Zoom in'));
      expect(forceGraphInstance.zoom).toHaveBeenCalledWith(
        2 * ZOOM_FACTOR,
        ZOOM_ANIMATION_DURATION,
      );

      fireEvent.click(screen.getByTitle('Zoom out'));
      expect(forceGraphInstance.zoom).toHaveBeenCalledWith(
        2 / ZOOM_FACTOR,
        ZOOM_ANIMATION_DURATION,
      );

      fireEvent.click(screen.getByTitle('Fit to view'));
      expect(forceGraphInstance.zoomToFit).toHaveBeenCalledWith(
        ZOOM_TO_FIT_DURATION,
        ZOOM_TO_FIT_PADDING,
      );
    });

    it('does nothing on hover or zoom before the instance is attached', async () => {
      await renderGraph({ foregroundGraph: graph });
      const { ref } = lastProps();
      ref.current = undefined;

      act(() => lastProps().onNodeHover(graph.nodes[0]));
      fireEvent.click(screen.getByTitle('Zoom in'));
      fireEvent.click(screen.getByTitle('Fit to view'));

      expect(screen.queryByText('Heading')).not.toBeInTheDocument();
      expect(forceGraphInstance.zoom).not.toHaveBeenCalled();
      expect(forceGraphInstance.zoomToFit).not.toHaveBeenCalled();
    });

    it('uses default colors after the container unmounts', async () => {
      const { unmount } = await renderGraph({ foregroundGraph: graph });
      const { nodeCanvasObject, linkColor } = lastProps();
      unmount();

      const context = createCanvasContext();
      nodeCanvasObject({ id: 'a', text: 'A', x: 0, y: 0 }, context);
      expect(context.beginPath).not.toHaveBeenCalled();
      expect(linkColor({ source: {}, target: {} })).toBe(DEFAULT_LINK_COLOR);
    });
  });

  describe('background graph', () => {
    it('renders a non-interactive graph with muted nodes and links', async () => {
      await renderGraph({ foregroundGraph: graph, backgroundGraph: true });
      const props = lastProps();

      expect(props.enableZoomInteraction).toBe(false);
      expect(props.enablePanInteraction).toBe(false);
      expect(props.enableNodeDrag).toBe(false);
      expect(props.graphData).toEqual(graph);
      expect(props.graphData).not.toBe(graph);

      const context = createCanvasContext();
      props.nodeCanvasObject({ x: 5, y: 6 }, context);
      expect(context.arc).toHaveBeenCalledWith(5, 6, 3, 0, 2 * Math.PI, false);
      expect(context.fillStyle).toBe('gray');
      expect(props.linkColor()).toBe(
        'color-mix(in oklab, gray 30%, transparent)',
      );
    });

    it('renders an empty container until data is fetched', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));
      const { default: GraphView2D } =
        await import('@/components/Graph/GraphView2D');
      const { container } = render(
        React.createElement(GraphView2D, { backgroundGraph: true }),
      );
      expect(container.firstElementChild).toBeEmptyDOMElement();
    });
  });
});
