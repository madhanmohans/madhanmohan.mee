import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const mockPush = vi.fn();
let pathname = '/graph';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => pathname,
}));

describe('ViewToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('labels each view with visible text', async () => {
    const { ViewToggle } = await import('@/components/layout/ViewToggle');
    render(<ViewToggle />);
    expect(screen.getByRole('button', { name: 'notes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'graph' })).toBeInTheDocument();
  });

  it.each([
    ['/graph', ['false', 'true']],
    ['/note', ['true', 'false']],
    ['/note/some/page', ['true', 'false']],
    ['/notebook', ['false', 'false']],
    ['/elsewhere', ['false', 'false']],
  ])('marks the active view on %s', async (path, expected) => {
    pathname = path;
    const { ViewToggle } = await import('@/components/layout/ViewToggle');
    render(<ViewToggle />);
    const states = screen
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-pressed'));
    expect(states).toEqual(expected);
  });

  it('navigates to the other view and remembers the choice', async () => {
    pathname = '/note/some/page';
    const { ViewToggle } = await import('@/components/layout/ViewToggle');
    const { getPreferredView } =
      await import('@/components/layout/viewPreference');
    render(<ViewToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'graph' }));
    expect(mockPush).toHaveBeenCalledWith('/graph');
    expect(getPreferredView()).toBe('graph');
  });

  it('does not navigate away when the active view is clicked', async () => {
    pathname = '/note/some/page';
    const { ViewToggle } = await import('@/components/layout/ViewToggle');
    const { getPreferredView } =
      await import('@/components/layout/viewPreference');
    localStorage.setItem('second-brain-view', 'graph');
    render(<ViewToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'notes' }));
    expect(mockPush).not.toHaveBeenCalled();
    expect(getPreferredView()).toBe('notes');
  });
});
