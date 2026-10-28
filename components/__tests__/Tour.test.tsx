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
        steps: [{ id: 'step1', title: 'Step 1', body: 'First step' }],
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
        steps: [{ id: 'step1', title: 'Step 1', body: 'First step' }],
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
        steps: [{ id: 's1', title: 'S1', body: 'B1' }],
      }),
    );

    expect(screen.getByText('done')).toBeInTheDocument();
  });

  it('marks tour as completed on skip', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      React.createElement(Tour, {
        id: 'home',
        steps: [{ id: 's1', title: 'S1', body: 'B1' }],
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
        steps: [{ id: 's1', title: 'S1', body: 'B1' }],
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
        steps: [{ id: 's1', title: 'S1', body: 'B1' }],
      }),
    );

    expect(screen.getByText('S1')).toBeInTheDocument();
    expect(screen.getByText('B1')).toBeInTheDocument();
  });
});

describe('Tour positioning and navigation', () => {
  function addTarget(name: string, rect: Partial<DOMRect>) {
    const element = document.createElement('div');
    element.setAttribute('data-tour', name);
    element.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 0, height: 0, bottom: 0, ...rect }) as DOMRect;
    document.body.appendChild(element);
    return element;
  }

  const cardOf = (title: string) =>
    screen.getByText(title).closest('.tour-card') as HTMLElement;

  afterEach(() => {
    document.querySelectorAll('[data-tour]').forEach((el) => el.remove());
  });

  it('positions the card below a target and marks it active', async () => {
    const target = addTarget('a', { left: 400, width: 100, bottom: 50 });
    const { Tour } = await import('@/components/Tour');
    render(
      <Tour
        id="pos"
        steps={[
          { id: 's1', title: 'Below', body: 'b', selector: '[data-tour="a"]' },
        ]}
      />,
    );

    const card = cardOf('Below');
    expect(card.style.top).toBe('64px');
    expect(card.style.left).toBe('310px');
    expect(card.style.width).toBe('280px');
    expect(card.querySelector('.tour-arrow')).toHaveStyle({ left: '134px' });
    expect(target).toHaveAttribute('data-tour-active', 'true');
  });

  it('positions the card above a target and clamps it to the viewport edges', async () => {
    addTarget('top', { left: 0, width: 10, top: 300 });
    addTarget('right', { left: window.innerWidth - 10, width: 10, bottom: 0 });
    const { Tour } = await import('@/components/Tour');
    render(
      <Tour
        id="clamp"
        steps={[
          {
            id: 's1',
            title: 'Above',
            body: 'b',
            selector: '[data-tour="top"]',
            placement: 'top',
          },
          {
            id: 's2',
            title: 'Right',
            body: 'b',
            selector: '[data-tour="right"]',
          },
        ]}
      />,
    );

    const aboveCard = cardOf('Above');
    expect(aboveCard.style.top).toBe('286px');
    expect(aboveCard.style.left).toBe('12px');
    expect(aboveCard.querySelector('.tour-arrow')).toHaveStyle({
      left: '12px',
    });

    fireEvent.click(screen.getByText('next →'));
    await vi.waitFor(() =>
      expect(cardOf('Right').style.left).toBe(
        `${window.innerWidth - 280 - 12}px`,
      ),
    );
  });

  it('moves the active marker between targets and clears it on dismiss', async () => {
    const first = addTarget('first', {});
    const second = addTarget('second', {});
    const { Tour } = await import('@/components/Tour');
    render(
      <Tour
        id="markers"
        steps={[
          {
            id: 's1',
            title: 'First',
            body: 'b',
            selector: '[data-tour="first"]',
          },
          {
            id: 's2',
            title: 'Second',
            body: 'b',
            selector: '[data-tour="second"]',
          },
        ]}
      />,
    );

    expect(first).toHaveAttribute('data-tour-active');
    fireEvent.click(screen.getByText('next →'));
    await vi.waitFor(() => expect(second).toHaveAttribute('data-tour-active'));
    expect(first).not.toHaveAttribute('data-tour-active');

    fireEvent.click(screen.getByText('skip'));
    expect(second).not.toHaveAttribute('data-tour-active');
  });

  it('centers the card when the target is missing', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      <Tour
        id="missing"
        steps={[
          {
            id: 's1',
            title: 'Gone',
            body: 'b',
            selector: '[data-tour="nope"]',
          },
        ]}
      />,
    );
    expect(cardOf('Gone').style.top).toBe('50%');
    expect(cardOf('Gone').querySelector('.tour-arrow')).toBeNull();
  });

  it('goes back with the back button and advances with Space', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      <Tour
        id="nav"
        steps={[
          { id: 's1', title: 'One', body: 'b' },
          { id: 's2', title: 'Two', body: 'b' },
        ]}
      />,
    );

    expect(screen.queryByText('←')).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: ' ' });
    await vi.waitFor(() => expect(screen.getByText('Two')).toBeInTheDocument());
    expect(screen.getByText('02 / 02')).toBeInTheDocument();

    fireEvent.click(screen.getByText('←'));
    await vi.waitFor(() => expect(screen.getByText('One')).toBeInTheDocument());

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('completes the tour from the last step', async () => {
    const { Tour } = await import('@/components/Tour');
    render(
      <Tour id="finish" steps={[{ id: 's1', title: 'Only', body: 'b' }]} />,
    );

    fireEvent.click(screen.getByText('done'));
    await vi.waitFor(() =>
      expect(screen.queryByText('Only')).not.toBeInTheDocument(),
    );
    expect(localStorage.getItem('site-tour-finish-done')).toBe('1');
  });

  it('dismisses when the overlay is clicked, but not when the card is', async () => {
    const { Tour } = await import('@/components/Tour');
    const { container } = render(
      <Tour
        id="overlay"
        steps={[{ id: 's1', title: 'Centered', body: 'b' }]}
      />,
    );

    fireEvent.click(cardOf('Centered'));
    expect(screen.getByText('Centered')).toBeInTheDocument();

    fireEvent.click(container.querySelector('.fixed.inset-0')!);
    await vi.waitFor(() =>
      expect(screen.queryByText('Centered')).not.toBeInTheDocument(),
    );
  });

  it('still dismisses when saving completion fails', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { Tour } = await import('@/components/Tour');
    render(
      <Tour id="nosave" steps={[{ id: 's1', title: 'Step', body: 'b' }]} />,
    );

    fireEvent.click(screen.getByText('skip'));
    await vi.waitFor(() =>
      expect(screen.queryByText('Step')).not.toBeInTheDocument(),
    );
  });
});
