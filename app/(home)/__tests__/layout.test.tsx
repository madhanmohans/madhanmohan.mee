import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('fumadocs-ui/layouts/home', () => ({
  HomeLayout: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'home-layout' }, children),
}));

vi.mock('@/lib/layout.shared', () => ({
  baseOptions: () => ({ nav: { title: 'Test' }, themeSwitch: { enabled: true } }),
}));

describe('Home Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children inside HomeLayout', async () => {
    const { default: Layout } = await import('@/app/(home)/layout');
    const { container } = render(
      React.createElement(Layout, {
        children: React.createElement('div', { 'data-testid': 'child' }, 'hello'),
      }),
    );

    expect(
      container.querySelector('[data-testid="home-layout"]'),
    ).toBeInTheDocument();
  });
});
