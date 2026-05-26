import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const mockExecuteMdx = vi.fn();

vi.mock('@fumadocs/mdx-remote/client', () => ({
  executeMdx: (...args: unknown[]) => mockExecuteMdx(...args),
}));

vi.mock('fumadocs-ui/mdx', () => ({
  default: {
    p: (props: any) => React.createElement('p', null, props.children),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

async function loadMdxPreview() {
  const mod = await import('@/components/MDXPreview');
  return mod.MdxPreview;
}

describe('MdxPreview', () => {
  it('renders loading state initially', async () => {
    mockExecuteMdx.mockImplementation(
      () => new Promise(() => {}),
    );

    const MdxPreview = await loadMdxPreview();
    render(React.createElement(MdxPreview, { compiled: '# Test' }));
    expect(screen.getByText('Rendering…')).toBeInTheDocument();
  });

  it('renders compiled component after successful execution', async () => {
    const MockComponent = () => React.createElement('div', null, 'Rendered!');
    mockExecuteMdx.mockResolvedValue({ default: MockComponent });

    const MdxPreview = await loadMdxPreview();
    render(React.createElement(MdxPreview, { compiled: '# Hello' }));

    await vi.waitFor(() => {
      expect(screen.getByText('Rendered!')).toBeInTheDocument();
    });
  });

  it('shows error message on execution failure', async () => {
    mockExecuteMdx.mockRejectedValue(new Error('MDX parse error'));

    const MdxPreview = await loadMdxPreview();
    render(React.createElement(MdxPreview, { compiled: '# Bad' }));

    await vi.waitFor(() => {
      expect(screen.getByText('MDX parse error')).toBeInTheDocument();
    });
  });

  it('renders loading state for empty compiled string', async () => {
    const MdxPreview = await loadMdxPreview();
    const { container } = render(
      React.createElement(MdxPreview, { compiled: '' }),
    );
    await vi.waitFor(() => {
      expect(screen.getByText('Rendering…')).toBeInTheDocument();
    });
  });
});
