import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const mockFetch = vi.fn();
const mockPush = vi.fn();

vi.stubGlobal('fetch', mockFetch);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
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

describe('GraphMini', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          nodes: [{ id: '/docs/a', text: 'A' }],
          links: [],
        }),
    });
  });

  it('fetches graph data and renders canvas when data arrives', async () => {
    const { GraphMini } = await import('@/components/Graph/GraphMini');

    const { container } = render(
      React.createElement(GraphMini, { pageUrl: '/docs/a' }),
    );

    await vi.waitFor(() => {
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });

  it('renders "local graph" heading', async () => {
    const { GraphMini } = await import('@/components/Graph/GraphMini');

    render(React.createElement(GraphMini, { pageUrl: '/docs/a' }));

    await vi.waitFor(() => {
      expect(screen.getByText('local graph')).toBeInTheDocument();
    });
  });

  it('renders link to /second-brain', async () => {
    const { GraphMini } = await import('@/components/Graph/GraphMini');

    render(React.createElement(GraphMini, { pageUrl: '/docs/a' }));

    await vi.waitFor(() => {
      const link = screen.getByLabelText('Open graph view');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/second-brain');
    });
  });

  it('returns null before graph data is fetched', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));

    const { GraphMini } = await import('@/components/Graph/GraphMini');

    const { container } = render(
      React.createElement(GraphMini, { pageUrl: '/docs/a' }),
    );

    expect(container.textContent).toBe('');
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { GraphMini } = await import('@/components/Graph/GraphMini');

    const { container } = render(
      React.createElement(GraphMini, { pageUrl: '/docs/a' }),
    );

    await vi.waitFor(() => {
      expect(container.textContent).toBe('');
      expect(screen.queryByText('local graph')).not.toBeInTheDocument();
    });
  });

  it('includes a waypoints icon button', async () => {
    const { GraphMini } = await import('@/components/Graph/GraphMini');

    render(React.createElement(GraphMini, { pageUrl: '/docs/a' }));

    await vi.waitFor(() => {
      const btn = screen.getByLabelText('Open graph view');
      expect(btn.querySelector('svg')).toBeInTheDocument();
    });
  });
});
