import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const dynamicLoaders: Array<() => Promise<any>> = [];

vi.mock('next/dynamic', () => ({
  default: (importFn: () => Promise<any>) => {
    dynamicLoaders.push(importFn);
    const MockComponent = () =>
      React.createElement('div', {
        'data-testid': 'dynamic-tour',
      });
    return MockComponent;
  },
}));

describe('NotesTour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dynamically loaded Tour component', async () => {
    const { NotesTour } = await import('@/components/tour/NotesTour');
    render(React.createElement(NotesTour));

    const tourEl = screen.getByTestId('dynamic-tour');
    expect(tourEl).toBeInTheDocument();
  });

  it('lazily loads the Tour component', async () => {
    await import('@/components/tour/NotesTour');
    const { Tour } = await import('@/components/tour/Tour');
    await expect(dynamicLoaders[0]()).resolves.toBe(Tour);
  });
});
