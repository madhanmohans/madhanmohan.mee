import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const mockPush = vi.fn();
let pathname = '/note';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => pathname,
}));

describe('ViewToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it.each([
    ['/note', ['true', 'false']],
    ['/graph', ['false', 'true']],
    ['/elsewhere', ['false', 'false']],
  ])('marks the active view on %s', async (path, expected) => {
    pathname = path;
    const { ViewToggle } = await import('@/components/layout/ViewToggle');
    render(<ViewToggle />);
    const states = screen
      .getAllByRole('button')
      .map((button) => button.getAttribute('data-active'));
    expect(states).toEqual(expected);
  });

  it('shows a text label next to each icon', async () => {
    const { ViewToggle } = await import('@/components/layout/ViewToggle');
    render(<ViewToggle />);
    expect(screen.getByRole('button', { name: 'notes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'graph' })).toBeInTheDocument();
  });

  it('navigates to the note and graph views and remembers the choice', async () => {
    const { ViewToggle } = await import('@/components/layout/ViewToggle');
    render(<ViewToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'graph' }));
    expect(mockPush).toHaveBeenCalledWith('/graph');
    expect(window.localStorage.getItem('view-preference')).toBe('graph');

    fireEvent.click(screen.getByRole('button', { name: 'notes' }));
    expect(mockPush).toHaveBeenCalledWith('/note');
    expect(window.localStorage.getItem('view-preference')).toBe('notes');
  });
});
