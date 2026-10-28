import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

const dynamicCalls: Array<{
  loader: () => Promise<{ default: unknown }>;
  options: { ssr: boolean; loading: React.FC };
}> = [];

vi.mock('next/dynamic', () => ({
  default: (loader: any, options: any) => {
    const index = dynamicCalls.push({ loader, options }) - 1;
    return function DynamicGraphMock(props: any) {
      return React.createElement(
        'div',
        { 'data-testid': 'dynamic-graph', 'data-index': index },
        JSON.stringify(props),
      );
    };
  },
}));

vi.mock('@/components/graph/2d/GraphView2D', () => ({
  default: 'GraphView2D',
}));
vi.mock('@/components/graph/3d/GraphView3D', () => ({
  default: 'GraphView3D',
}));

describe('GraphView', () => {
  it('renders the 3D view by default and passes props through', async () => {
    const { GraphView } = await import('@/components/graph/GraphView');
    const graph = { nodes: [], links: [] };
    render(<GraphView foregroundGraph={graph} />);

    const element = screen.getByTestId('dynamic-graph');
    expect(element).toHaveAttribute('data-index', '2');
    expect(JSON.parse(element.textContent!)).toEqual({
      foregroundGraph: graph,
    });
  });

  it('renders the 2D view when requested', async () => {
    const { GraphView } = await import('@/components/graph/GraphView');
    render(<GraphView dimension="2d" />);

    const element = screen.getByTestId('dynamic-graph');
    expect(element).toHaveAttribute('data-index', '0');
  });

  it('renders the background variants for background graphs', async () => {
    const { GraphView } = await import('@/components/graph/GraphView');
    const { unmount } = render(<GraphView dimension="2d" backgroundGraph />);

    const element = screen.getByTestId('dynamic-graph');
    expect(element).toHaveAttribute('data-index', '1');
    expect(JSON.parse(element.textContent!)).toEqual({ backgroundGraph: true });
    unmount();

    render(<GraphView backgroundGraph />);
    expect(screen.getByTestId('dynamic-graph')).toHaveAttribute(
      'data-index',
      '3',
    );
  });

  it('lazily loads each view client-side with a placeholder', async () => {
    await import('@/components/graph/GraphView');
    const [twoD, twoDBackground, threeD, threeDBackground] = dynamicCalls;

    expect((await twoD.loader()).default).toBe('GraphView2D');
    expect((await twoDBackground.loader()).default).toBe('GraphView2D');
    expect((await threeD.loader()).default).toBe('GraphView3D');
    expect((await threeDBackground.loader()).default).toBe('GraphView3D');
    for (const call of dynamicCalls) expect(call.options.ssr).toBe(false);

    // Interactive views hold the framed space; backgrounds just fill
    const Fallback = threeD.options.loading;
    const { container, unmount } = render(<Fallback />);
    expect(container.firstElementChild).toHaveClass('h-dvh', 'rounded-xl');
    expect(container.firstElementChild).toHaveAttribute('role', 'status');
    unmount();

    const BackgroundFallback = twoDBackground.options.loading;
    const background = render(<BackgroundFallback />);
    expect(background.container.firstElementChild).toHaveClass('size-full');
  });
});
