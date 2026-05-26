import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const mockUsePathname = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('GrainyBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video element when on home page', async () => {
    mockUsePathname.mockReturnValue('/');

    const { GrainyBackground } = await import(
      '@/components/BackgroundVideo'
    );
    const { container } = render(React.createElement(GrainyBackground));
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
  });

  it('does not render video when not on home page', async () => {
    mockUsePathname.mockReturnValue('/docs/test');

    const { GrainyBackground } = await import(
      '@/components/BackgroundVideo'
    );
    const { container } = render(React.createElement(GrainyBackground));
    expect(container.querySelector('video')).toBeNull();
  });
});
