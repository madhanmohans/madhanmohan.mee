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
  });

  it.each([
    ['/graph', ['true', 'false']],
    ['/note', ['false', 'true']],
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

  it('navigates to the graph and note views', async () => {
    const { ViewToggle } = await import('@/components/layout/ViewToggle');
    render(<ViewToggle />);
    const [graphButton, noteButton] = screen.getAllByRole('button');

    fireEvent.click(graphButton);
    expect(mockPush).toHaveBeenCalledWith('/graph');
    fireEvent.click(noteButton);
    expect(mockPush).toHaveBeenCalledWith('/note');
  });
});
