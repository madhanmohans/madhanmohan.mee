import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('next/dynamic', () => ({
  default: (importFn: () => Promise<any>) => {
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
});
