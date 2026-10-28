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

describe('DocsTour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dynamically loaded Tour component', async () => {
    const { DocsTour } = await import('@/components/DocsTour');
    render(React.createElement(DocsTour));

    const tourEl = screen.getByTestId('dynamic-tour');
    expect(tourEl).toBeInTheDocument();
  });

  it('lazily loads the Tour component', async () => {
    await import('@/components/DocsTour');
    const { Tour } = await import('@/components/Tour');
    await expect(dynamicLoaders[0]()).resolves.toBe(Tour);
  });
});
