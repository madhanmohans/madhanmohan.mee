import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('fumadocs-ui/layouts/docs', () => ({
  DocsLayout: ({ children, tree }: { children: React.ReactNode; tree: any }) =>
    React.createElement('div', { 'data-testid': 'docs-layout' }, children),
}));

vi.mock('@/lib/source', () => ({
  source: {
    getPageTree: () => ({ name: 'root', children: [] }),
  },
}));

vi.mock('@/lib/layout.shared', () => ({
  baseOptions: () => ({ nav: { title: 'Test' } }),
}));

describe('Docs Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children inside DocsLayout', async () => {
    const { default: Layout } = await import('@/app/column/layout');
    const { container } = render(
      React.createElement(Layout, {
        children: React.createElement('div', { 'data-testid': 'child' }),
      }),
    );

    expect(
      container.querySelector('[data-testid="docs-layout"]'),
    ).toBeInTheDocument();
  });
});
