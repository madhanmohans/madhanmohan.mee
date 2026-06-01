import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('fumadocs-ui/utils/use-copy-button', () => ({
  useCopyButton: () => [false, vi.fn()],
}));

vi.mock('fumadocs-ui/components/ui/button', () => ({
  buttonVariants: ({ color, size, className }: any) =>
    `btn-${color}-${size} ${className || ''}`,
}));

vi.mock('fumadocs-ui/components/ui/popover', () => ({
  Popover: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'popover' }, children),
  PopoverContent: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'popover-content' }, children),
  PopoverTrigger: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'popover-trigger' }, children),
}));

describe('LLMCopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with Copy Markdown label', async () => {
    const { LLMCopyButton } = await import('@/components/PageActions');
    render(
      React.createElement(LLMCopyButton, {
        markdownUrl: '/docs/test.mdx',
      }),
    );
    expect(screen.getByText('Copy Markdown')).toBeInTheDocument();
  });

  it('renders a button element', async () => {
    const { LLMCopyButton } = await import('@/components/PageActions');
    render(
      React.createElement(LLMCopyButton, {
        markdownUrl: '/docs/test.mdx',
      }),
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('ViewOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders popover with Open trigger', async () => {
    const { ViewOptions } = await import('@/components/PageActions');
    render(
      React.createElement(ViewOptions, {
        markdownUrl: '/docs/test.mdx',
      }),
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders AI platform links', async () => {
    const { ViewOptions } = await import('@/components/PageActions');
    render(
      React.createElement(ViewOptions, {
        markdownUrl: '/docs/test.mdx',
      }),
    );

    await vi.waitFor(() => {
      expect(screen.getByText('Open in Scira AI')).toBeInTheDocument();
      expect(screen.getByText('Open in ChatGPT')).toBeInTheDocument();
      expect(screen.getByText('Open in Claude')).toBeInTheDocument();
      expect(screen.getByText('Open in Cursor')).toBeInTheDocument();
    });
  });
});
