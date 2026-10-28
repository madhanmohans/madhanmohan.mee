import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

describe('LocalGraph', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          nodes: [{ id: '/note/a', text: 'A' }],
          links: [],
        }),
    });
  });

  it('fetches graph data and renders canvas when data arrives', async () => {
    const { LocalGraph } = await import('@/components/graph/local/LocalGraph');

    const { container } = render(
      React.createElement(LocalGraph, { pageUrl: '/note/a' }),
    );

    await vi.waitFor(() => {
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });

  it('returns null before graph data is fetched', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));

    const { LocalGraph } = await import('@/components/graph/local/LocalGraph');

    const { container } = render(
      React.createElement(LocalGraph, { pageUrl: '/note/a' }),
    );

    expect(container.textContent).toBe('');
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { LocalGraph } = await import('@/components/graph/local/LocalGraph');

    const { container } = render(
      React.createElement(LocalGraph, { pageUrl: '/note/a' }),
    );

    await vi.waitFor(() => {
      expect(container.textContent).toBe('');
      expect(screen.queryByText('local graph')).not.toBeInTheDocument();
    });
  });
});

describe('LocalGraph canvas', () => {
  const frameCallbacks: FrameRequestCallback[] = [];
  let context: Record<string, any>;

  function flushFrames(count: number) {
    for (let i = 0; i < count; i++) frameCallbacks.shift()?.(0);
  }

  function lastTransform() {
    return context.setTransform.mock.calls.at(-1);
  }

  function dispatchTouch(
    target: EventTarget,
    type: string,
    touches: { clientX: number; clientY: number }[],
  ) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'touches', { value: touches });
    target.dispatchEvent(event);
  }

  async function renderMini(
    graph: { nodes: any[]; links: any[] },
    pageUrl = '/note/a',
  ) {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve(graph) });
    const { LocalGraph } = await import('@/components/graph/local/LocalGraph');
    const result = render(React.createElement(LocalGraph, { pageUrl }));
    let canvas: HTMLCanvasElement | null = null;
    await vi.waitFor(() => {
      canvas = result.container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
      expect(context.fillText).toHaveBeenCalled();
    });
    return { ...result, canvas: canvas! };
  }

  // a lone node feels no net force, so it stays at the canvas center (150, 100)
  const singleNodeGraph = {
    nodes: [{ id: '/note/a', text: 'A' }],
    links: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    frameCallbacks.length = 0;
    context = {
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 300,
      height: 200,
    } as DOMRect);
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frameCallbacks.push(callback);
        return frameCallbacks.length;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', mockFetch);
  });

  it('sizes the canvas to the container', async () => {
    const { canvas } = await renderMini(singleNodeGraph);
    expect(canvas.width).toBe(300);
    expect(canvas.height).toBe(200);
    expect(canvas.style.width).toBe('300px');
    expect(canvas.style.height).toBe('200px');
  });

  it('renders only the local neighborhood, with links and truncated labels', async () => {
    await renderMini({
      nodes: [
        { id: '/note/a', text: 'A' },
        { id: '/note/b', text: 'A very long neighbor title' },
        { id: '/note/c', text: 'C' },
        { id: '/note/far', text: 'Far' },
      ],
      links: [
        { source: '/note/a', target: '/note/b' },
        { source: { id: '/note/c' }, target: { id: '/note/a' } },
        { source: '/note/far', target: '/note/c' },
      ],
    });

    const labels = context.fillText.mock.calls.map((call: any[]) => call[0]);
    expect(labels).toContain('A');
    expect(labels).toContain('C');
    expect(labels).toContain('A very long ne…');
    expect(labels).not.toContain('Far');
    expect(context.stroke).toHaveBeenCalledTimes(2);
  });

  it('shows a placeholder node when the page is not in the graph', async () => {
    await renderMini({ nodes: [], links: [] }, '/note/missing');
    expect(context.fillText).toHaveBeenCalledWith(
      'Current',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('runs the simulation for a fixed number of frames, then only redraws on demand', async () => {
    await renderMini(singleNodeGraph);
    flushFrames(200);
    const drawCount = context.clearRect.mock.calls.length;
    expect(drawCount).toBe(120);

    flushFrames(5);
    expect(context.clearRect).toHaveBeenCalledTimes(drawCount);
  });

  it('navigates when a node is clicked and ignores clicks on empty space', async () => {
    const { canvas } = await renderMini(singleNodeGraph);

    fireEvent.click(canvas, { clientX: 0, clientY: 0 });
    expect(mockPush).not.toHaveBeenCalled();

    fireEvent.click(canvas, { clientX: 150, clientY: 100 });
    expect(mockPush).toHaveBeenCalledWith('/note/a');
  });

  it('shows a pointer cursor only over nodes', async () => {
    const { canvas } = await renderMini(singleNodeGraph);

    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 100 });
    expect(canvas.style.cursor).toBe('pointer');

    fireEvent.mouseMove(canvas, { clientX: 0, clientY: 0 });
    expect(canvas.style.cursor).toBe('grab');
  });

  it('zooms around the cursor with the wheel, clamped to the zoom limits', async () => {
    const { canvas } = await renderMini(singleNodeGraph);
    flushFrames(120);

    fireEvent.wheel(canvas, { deltaY: -1, clientX: 0, clientY: 0 });
    flushFrames(1);
    expect(lastTransform()).toEqual([1.08, 0, 0, 1.08, 0, 0]);

    for (let i = 0; i < 100; i++) fireEvent.wheel(canvas, { deltaY: 1 });
    flushFrames(1);
    expect(lastTransform()[0]).toBeCloseTo(0.3);
  });

  it('pans with the mouse when dragging empty space', async () => {
    const { canvas } = await renderMini(singleNodeGraph);
    flushFrames(120);

    fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });
    expect(canvas.style.cursor).toBe('grabbing');
    fireEvent.mouseMove(window, { clientX: 10, clientY: 20 });
    fireEvent.mouseUp(window);
    expect(canvas.style.cursor).toBe('grab');
    flushFrames(1);
    expect(lastTransform()).toEqual([1, 0, 0, 1, 10, 20]);

    fireEvent.mouseMove(window, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(window);
    flushFrames(1);
    expect(lastTransform()).toEqual([1, 0, 0, 1, 10, 20]);
  });

  it('does not pan when dragging starts on a node', async () => {
    const { canvas } = await renderMini(singleNodeGraph);
    flushFrames(120);

    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 100 });
    expect(canvas.style.cursor).not.toBe('grabbing');
    fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
    flushFrames(1);
    expect(context.clearRect).toHaveBeenCalledTimes(120);
  });

  it('pans with a single touch and stops after all touches end', async () => {
    const { canvas } = await renderMini(singleNodeGraph);
    flushFrames(120);

    dispatchTouch(canvas, 'touchstart', [{ clientX: 10, clientY: 10 }]);
    dispatchTouch(canvas, 'touchmove', [{ clientX: 30, clientY: 40 }]);
    flushFrames(1);
    expect(lastTransform()).toEqual([1, 0, 0, 1, 20, 30]);

    dispatchTouch(canvas, 'touchend', []);
    dispatchTouch(canvas, 'touchmove', [{ clientX: 100, clientY: 100 }]);
    flushFrames(1);
    expect(lastTransform()).toEqual([1, 0, 0, 1, 20, 30]);
  });

  it('pinch-zooms with two touches and resumes panning when one lifts', async () => {
    const { canvas } = await renderMini(singleNodeGraph);
    flushFrames(120);

    dispatchTouch(canvas, 'touchstart', [
      { clientX: 0, clientY: 0 },
      { clientX: 100, clientY: 0 },
    ]);
    dispatchTouch(canvas, 'touchmove', [
      { clientX: 0, clientY: 0 },
      { clientX: 200, clientY: 0 },
    ]);
    flushFrames(1);
    expect(lastTransform()).toEqual([2, 0, 0, 2, -50, 0]);

    dispatchTouch(canvas, 'touchend', [{ clientX: 0, clientY: 0 }]);
    dispatchTouch(canvas, 'touchmove', [{ clientX: 5, clientY: 5 }]);
    flushFrames(1);
    expect(lastTransform()).toEqual([2, 0, 0, 2, -45, 5]);
  });

  it('cancels the animation and removes listeners on unmount', async () => {
    const { canvas, unmount } = await renderMini(singleNodeGraph);
    const removeCanvasListener = vi.spyOn(canvas, 'removeEventListener');
    const removeWindowListener = vi.spyOn(window, 'removeEventListener');

    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(removeCanvasListener).toHaveBeenCalledTimes(5);
    expect(removeWindowListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(removeWindowListener).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function),
    );
  });
});
