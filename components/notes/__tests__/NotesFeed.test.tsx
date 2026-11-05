import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotesFeed } from '@/components/notes/NotesFeed';

vi.mock('@/components/motion/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

let triggerIntersect: () => void = () => {};

class FakeObserver {
  constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
    triggerIntersect = () => callback([{ isIntersecting: true }]);
  }
  observe() {}
  disconnect() {
    triggerIntersect = () => {};
  }
}

const page1 = {
  notes: [{ url: '/note/a', title: 'A' }],
  nextCursor: '/note/a',
};
const page2 = { notes: [{ url: '/note/b', title: 'B' }], nextCursor: null };

describe('NotesFeed', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    window.scrollTo = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => page1 })
        .mockResolvedValueOnce({ ok: true, json: async () => page2 }),
    );
  });

  it('loads the first page, then the next on intersect, then stops', async () => {
    render(<NotesFeed />);
    expect(await screen.findByText('A')).toBeInTheDocument();
    expect(fetch).toHaveBeenLastCalledWith('/api/notes?');

    act(() => triggerIntersect());
    expect(await screen.findByText('B')).toBeInTheDocument();
    expect(fetch).toHaveBeenLastCalledWith('/api/notes?cursor=%2Fnote%2Fa');

    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument(),
    );
    act(() => triggerIntersect());
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('restores loaded notes and scroll position on remount', async () => {
    const first = render(<NotesFeed />);
    await screen.findByText('A');
    window.scrollY = 120;
    first.unmount();

    render(<NotesFeed />);
    expect(await screen.findByText('A')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith(0, 120));
  });
});
