import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const mockRouterRefresh = vi.fn();
const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
}));

vi.mock('@/components/MDXPreview', () => ({
  MdxPreview: ({ compiled }: { compiled: string }) =>
    React.createElement('div', { 'data-testid': 'mdx-preview' }, compiled),
}));

vi.mock('fumadocs-ui/components/ui/button', () => ({
  buttonVariants: ({ color, size, className }: any) =>
    `btn-${color}-${size} ${className || ''}`,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockImplementation((url: string) => {
    if (url.startsWith('/api/notes/')) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('# Test content'),
      });
    }
    if (url === '/api/preview') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ compiled: '' }),
      });
    }
    return Promise.resolve({ ok: true });
  });
});

describe('NoteEditor', () => {
  const defaultProps = {
    slug: ['test', 'note'],
    children: React.createElement('div', null, 'Page content'),
  };

  it('renders children in view mode', async () => {
    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('shows Edit button in view mode', async () => {
    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('switches to edit mode on Edit click', async () => {
    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));

    fireEvent.click(screen.getByText('Edit'));

    await vi.waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('saves content on Save click', async () => {
    mockFetch.mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'PUT') {
        return Promise.resolve({ ok: true });
      }
      if (url.startsWith('/api/notes/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('# Content'),
        });
      }
      if (url === '/api/preview') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ compiled: '' }),
        });
      }
      return Promise.resolve({ ok: true });
    });

    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));

    fireEvent.click(screen.getByText('Edit'));

    await vi.waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '# Updated' } });
    fireEvent.click(screen.getByText('Save'));

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/notes/test/note',
        expect.objectContaining({ method: 'PUT' }),
      );
    });
  });

  it('shows confirm-discard when canceling with unsaved changes', async () => {
    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));

    fireEvent.click(screen.getByText('Edit'));

    await vi.waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Changed' } });
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('Discard changes?')).toBeInTheDocument();
  });

  it('inserts tab character on Tab key', async () => {
    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));

    fireEvent.click(screen.getByText('Edit'));

    await vi.waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());

    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Tab' });

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('shows line count in edit mode', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.startsWith('/api/notes/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('Line 1\nLine 2\nLine 3'),
        });
      }
      if (url === '/api/preview') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ compiled: '' }),
        });
      }
      return Promise.resolve({ ok: true });
    });

    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));

    fireEvent.click(screen.getByText('Edit'));

    await vi.waitFor(() => {
      expect(screen.getByText('3 lines')).toBeInTheDocument();
    });
  });
});
