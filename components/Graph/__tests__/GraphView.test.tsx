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

vi.mock('@/components/Graph/GraphView2D', () => ({ default: 'GraphView2D' }));
vi.mock('@/components/Graph/GraphView3D', () => ({ default: 'GraphView3D' }));

describe('GraphView', () => {
  it('renders the 3D view by default and passes props through', async () => {
    const { GraphView } = await import('@/components/Graph/GraphView');
    const graph = { nodes: [], links: [] };
    render(<GraphView foregroundGraph={graph} />);

    const element = screen.getByTestId('dynamic-graph');
    expect(element).toHaveAttribute('data-index', '1');
    expect(JSON.parse(element.textContent!)).toEqual({
      foregroundGraph: graph,
    });
  });

  it('renders the 2D view when requested', async () => {
    const { GraphView } = await import('@/components/Graph/GraphView');
    render(<GraphView dimension="2d" backgroundGraph />);

    const element = screen.getByTestId('dynamic-graph');
    expect(element).toHaveAttribute('data-index', '0');
    expect(JSON.parse(element.textContent!)).toEqual({ backgroundGraph: true });
  });

  it('lazily loads each view client-side with a placeholder', async () => {
    await import('@/components/Graph/GraphView');
    const [twoD, threeD] = dynamicCalls;

    expect((await twoD.loader()).default).toBe('GraphView2D');
    expect((await threeD.loader()).default).toBe('GraphView3D');
    expect(twoD.options.ssr).toBe(false);

    const Fallback = threeD.options.loading;
    const { container } = render(<Fallback />);
    expect(container.firstElementChild).toHaveClass('bg-fd-background');
  });
});
