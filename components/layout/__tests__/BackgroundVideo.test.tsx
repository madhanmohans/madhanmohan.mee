import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUsePathname = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('BackgroundVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video element when on home page', async () => {
    mockUsePathname.mockReturnValue('/');

    const { BackgroundVideo } =
      await import('@/components/layout/BackgroundVideo');
    const { container } = render(React.createElement(BackgroundVideo));
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
  });

  it('limits the video source to non-phone screens', async () => {
    mockUsePathname.mockReturnValue('/');

    const { BackgroundVideo } =
      await import('@/components/layout/BackgroundVideo');
    const { container } = render(React.createElement(BackgroundVideo));
    expect(container.querySelector('source')).toHaveAttribute(
      'media',
      '(min-width: 641px)',
    );
  });

  it('does not render video when not on home page', async () => {
    mockUsePathname.mockReturnValue('/note/test');

    const { BackgroundVideo } =
      await import('@/components/layout/BackgroundVideo');
    const { container } = render(React.createElement(BackgroundVideo));
    expect(container.querySelector('video')).toBeNull();
  });
});
