import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const mockPush = vi.fn();
const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/graph',
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => React.createElement('a', { href, ...props }, children),
}));

vi.mock('@/components/graph/GraphView', () => ({
  GraphView: ({
    foregroundGraph,
    dimension,
  }: {
    foregroundGraph?: any;
    dimension?: string;
  }) =>
    React.createElement('div', {
      'data-testid': 'graph-view',
      'data-dimension': dimension || '',
      'data-has-graph': String(!!foregroundGraph),
    }),
}));

vi.mock('@/components/tour/Tour', () => ({
  Tour: ({ id, steps }: { id: string; steps: Array<any> }) =>
    React.createElement(
      'div',
      { 'data-testid': 'tour', 'data-id': id },
      `${steps.length} steps`,
    ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SecondBrainPage', () => {
  it('shows loading state initially', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));

    const { default: SecondBrainPage } = await import('@/app/graph/page');
    render(React.createElement(SecondBrainPage));

    expect(screen.getByText('loading...')).toBeInTheDocument();
  });

  it('renders graph after data loads', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ nodes: [], links: [] }),
    });

    const { default: SecondBrainPage } = await import('@/app/graph/page');
    render(React.createElement(SecondBrainPage));

    await vi.waitFor(() => {
      const graph = screen.getByTestId('graph-view');
      expect(graph).toHaveAttribute('data-has-graph', 'true');
    });
  });

  it('switches between 2D and 3D views', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ nodes: [], links: [] }),
    });

    const { default: SecondBrainPage } = await import('@/app/graph/page');
    render(React.createElement(SecondBrainPage));

    await vi.waitFor(() => {
      expect(screen.getByTestId('graph-view')).toBeInTheDocument();
    });

    const graph = screen.getByTestId('graph-view');
    expect(graph).toHaveAttribute('data-dimension', '2d');

    fireEvent.click(screen.getByRole('button', { name: '3d' }));
    expect(screen.getByTestId('graph-view')).toHaveAttribute(
      'data-dimension',
      '3d',
    );
    expect(screen.getByRole('button', { name: '3d' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('renders toggle buttons', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ nodes: [], links: [] }),
    });

    const { default: SecondBrainPage } = await import('@/app/graph/page');
    render(React.createElement(SecondBrainPage));

    expect(screen.getByRole('button', { name: '2d' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3d' })).toBeInTheDocument();
  });

  it('renders home link', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ nodes: [], links: [] }),
    });

    const { default: SecondBrainPage } = await import('@/app/graph/page');
    render(React.createElement(SecondBrainPage));

    const homeLink = screen.getByText((content, element) => {
      return element?.tagName === 'A' && element?.getAttribute('href') === '/';
    });
    expect(homeLink).toBeInTheDocument();
  });

  it('renders docs navigation button', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ nodes: [], links: [] }),
    });

    const { default: SecondBrainPage } = await import('@/app/graph/page');
    render(React.createElement(SecondBrainPage));

    const viewToggle = document.querySelector('[data-tour="view-toggle"]');
    expect(viewToggle).not.toBeNull();
    const buttons = viewToggle!.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const docsBtn = buttons[1] as HTMLButtonElement;
    fireEvent.click(docsBtn);
    expect(mockPush).toHaveBeenCalledWith('/note');
  });

  it('renders Tour with correct steps', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ nodes: [], links: [] }),
    });

    const { default: SecondBrainPage } = await import('@/app/graph/page');
    render(React.createElement(SecondBrainPage));

    const tour = screen.getByTestId('tour');
    expect(tour).toHaveAttribute('data-id', 'second-brain');
  });
});
