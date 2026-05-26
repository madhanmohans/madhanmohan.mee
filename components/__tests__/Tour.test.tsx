import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

const STORAGE_KEY = 'site-tour-home-done';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) =>
      React.createElement('div', props, children),
    span: ({ children, ...props }: any) =>
      React.createElement('span', props, children),
  },
  AnimatePresence: ({ children }: any) =>
    React.createElement(React.Fragment, null, children),
}));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Tour', () => {
  it('renders tour when not completed', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 'step1', title: 'Step 1', body: 'First step' },
        ],
      }),
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('First step')).toBeInTheDocument();
  });

  it('does not render tour when already completed', async () => {
    localStorage.setItem(STORAGE_KEY, '1');
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 'step1', title: 'Step 1', body: 'First step' },
        ],
      }),
    );

    expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
  });

  it('advances through steps on next click', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 's1', title: 'Step 1', body: 'Body 1' },
          { id: 's2', title: 'Step 2', body: 'Body 2' },
        ],
      }),
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('next →'));

    await vi.waitFor(() => {
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Body 2')).toBeInTheDocument();
    });
  });

  it('shows done button on last step', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 's1', title: 'S1', body: 'B1' },
        ],
      }),
    );

    expect(screen.getByText('done')).toBeInTheDocument();
  });

  it('marks tour as completed on skip', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 's1', title: 'S1', body: 'B1' },
        ],
      }),
    );

    fireEvent.click(screen.getByText('skip'));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('1');

    await vi.waitFor(() => {
      expect(screen.queryByText('S1')).not.toBeInTheDocument();
    });
  });

  it('dismisses on Escape key', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 's1', title: 'S1', body: 'B1' },
        ],
      }),
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    await vi.waitFor(() => {
      expect(screen.queryByText('S1')).not.toBeInTheDocument();
    });
  });

  it('advances on ArrowRight key', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 's1', title: 'S1', body: 'B1' },
          { id: 's2', title: 'S2', body: 'B2' },
        ],
      }),
    );

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    await vi.waitFor(() => {
      expect(screen.getByText('S2')).toBeInTheDocument();
    });
  });

  it('goes back on ArrowLeft key', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 's1', title: 'S1', body: 'B1' },
          { id: 's2', title: 'S2', body: 'B2' },
        ],
      }),
    );

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await vi.waitFor(() => expect(screen.getByText('S2')).toBeInTheDocument());

    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    await vi.waitFor(() => {
      expect(screen.getByText('S1')).toBeInTheDocument();
    });
  });

  it('handles center-placed steps', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          {
            id: 'center',
            title: 'Center',
            body: 'Centered step',
            placement: 'center',
          },
        ],
      }),
    );

    expect(screen.getByText('Centered step')).toBeInTheDocument();
  });

  it('handles localStorage errors gracefully', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [
          { id: 's1', title: 'S1', body: 'B1' },
        ],
      }),
    );

    expect(screen.getByText('S1')).toBeInTheDocument();
    expect(screen.getByText('B1')).toBeInTheDocument();
  });
});
