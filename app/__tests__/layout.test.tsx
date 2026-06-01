import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('fumadocs-ui/provider/next', () => ({
  RootProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'root-provider' }, children),
}));

vi.mock('@/components/BackgroundVideo', () => ({
  Background: () => React.createElement('div', { 'data-testid': 'background' }),
}));

vi.mock('@/app/(home)/layout', () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'home-layout' }, children),
}));

describe('Root Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with skip-to-content link', async () => {
    const { default: Layout } = await import('@/app/layout');
    render(
      React.createElement(Layout, {
        children: React.createElement('div', null, 'test'),
      }),
    );

    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#nd-page');
  });

  it('renders RootProvider', async () => {
    const { default: Layout } = await import('@/app/layout');
    const { container } = render(
      React.createElement(Layout, {
        children: React.createElement('div', null, 'test'),
      }),
    );

    expect(
      container.querySelector('[data-testid="root-provider"]'),
    ).toBeInTheDocument();
  });
});
