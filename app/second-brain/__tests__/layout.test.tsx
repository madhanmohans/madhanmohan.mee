import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('SecondBrain Layout', () => {
  it('renders children directly', async () => {
    const { default: Layout } = await import('@/app/second-brain/layout');
    render(
      React.createElement(Layout, {
        children: React.createElement(
          'div',
          { 'data-testid': 'child' },
          'test',
        ),
      }),
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
