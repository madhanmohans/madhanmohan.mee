import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUsePathname = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('Background', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video element when on home page', async () => {
    mockUsePathname.mockReturnValue('/');

    const { Background: Background } =
      await import('@/components/BackgroundVideo');
    const { container } = render(React.createElement(Background));
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
  });

  it('does not render video when not on home page', async () => {
    mockUsePathname.mockReturnValue('/docs/test');

    const { Background: Background } =
      await import('@/components/BackgroundVideo');
    const { container } = render(React.createElement(Background));
    expect(container.querySelector('video')).toBeNull();
  });
});
