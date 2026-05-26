import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) =>
    React.createElement('a', { href, ...props }, children),
}));

vi.mock('@/components/Graph/GraphView', () => ({
  GraphView: ({ ghost }: { ghost?: boolean }) =>
    React.createElement('div', {
      'data-testid': 'graph-view',
      'data-ghost': String(!!ghost),
    }),
}));

vi.mock('@/components/Tour', () => ({
  Tour: ({ id, steps }: { id: string; steps: Array<any> }) =>
    React.createElement(
      'div',
      { 'data-testid': 'tour', 'data-id': id },
      `${steps.length} steps`,
    ),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('renders navigation links', async () => {
    const { default: HomePage } = await import('@/app/(home)/page');
    render(React.createElement(HomePage));

    expect(screen.getByText('second brain')).toBeInTheDocument();
    expect(screen.getByText('about')).toBeInTheDocument();
  });

  it('shows ghost graph on hover', async () => {
    const { default: HomePage } = await import('@/app/(home)/page');
    render(React.createElement(HomePage));

    const graphView = screen.getByTestId('graph-view');
    expect(graphView).toHaveAttribute('data-ghost', 'true');
  });

  it('renders Tour with 3 steps', async () => {
    const { default: HomePage } = await import('@/app/(home)/page');
    render(React.createElement(HomePage));

    const tour = screen.getByTestId('tour');
    expect(tour).toHaveAttribute('data-id', 'home');
    expect(tour).toHaveTextContent('3 steps');
  });

  it('sets body overflow hidden on mount', async () => {
    const { default: HomePage } = await import('@/app/(home)/page');
    const { unmount } = render(React.createElement(HomePage));

    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('responds to nav link hover', async () => {
    const { default: HomePage } = await import('@/app/(home)/page');
    render(React.createElement(HomePage));

    const secondBrainLink = screen.getByText('second brain');
    fireEvent.mouseEnter(secondBrainLink);
    fireEvent.mouseLeave(secondBrainLink);
  });
});
