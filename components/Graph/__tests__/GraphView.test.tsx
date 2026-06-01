import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('next/dynamic', () => ({
  default: () => {
    return function DynamicGraphMock(props: any) {
      return React.createElement(
        'div',
        { 'data-testid': 'dynamic-graph' },
        JSON.stringify(props),
      );
    };
  },
}));

describe('GraphView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dynamic graph component', async () => {
    const { GraphView } = await import('@/components/Graph/GraphView');
    const graph = { nodes: [], links: [] };
    render(React.createElement(GraphView, { graph }));
    expect(screen.getByTestId('dynamic-graph')).toBeInTheDocument();
  });

  it('renders without crashing when no graph provided', async () => {
    const { GraphView } = await import('@/components/Graph/GraphView');
    const { container } = render(React.createElement(GraphView));
    expect(container.querySelector('div')).toBeInTheDocument();
  });
});
