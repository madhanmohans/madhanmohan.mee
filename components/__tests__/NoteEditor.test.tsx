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

    await vi.waitFor(() =>
      expect(screen.getByRole('textbox')).toBeInTheDocument(),
    );

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

    await vi.waitFor(() =>
      expect(screen.getByRole('textbox')).toBeInTheDocument(),
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Changed' } });
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('Discard changes?')).toBeInTheDocument();
  });

  it('inserts tab character on Tab key', async () => {
    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));

    fireEvent.click(screen.getByText('Edit'));

    await vi.waitFor(() =>
      expect(screen.getByRole('textbox')).toBeInTheDocument(),
    );

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

describe('NoteEditor flows', () => {
  const defaultProps = {
    slug: ['test', 'note'],
    children: React.createElement('div', null, 'Page content'),
  };

  function mockApi({
    load = { ok: true, text: '# Content' },
    save = { ok: true },
    preview = { ok: true, body: { compiled: 'compiled-code' } as any },
  }: {
    load?: { ok: boolean; text: string };
    save?: { ok: boolean };
    preview?: { ok: boolean; body: any } | 'reject';
  } = {}) {
    mockFetch.mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'PUT') return Promise.resolve(save);
      if (url.startsWith('/api/notes/')) {
        return Promise.resolve({
          ok: load.ok,
          text: () => Promise.resolve(load.text),
        });
      }
      if (url === '/api/preview') {
        if (preview === 'reject') return Promise.reject(new Error('offline'));
        return Promise.resolve({
          ok: preview.ok,
          json: () => Promise.resolve(preview.body),
        });
      }
      return Promise.resolve({ ok: true });
    });
  }

  async function openEditor() {
    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));
    fireEvent.click(screen.getByText('Edit'));
    await vi.waitFor(() =>
      expect(screen.getByRole('textbox')).toBeInTheDocument(),
    );
    return screen.getByRole('textbox') as HTMLTextAreaElement;
  }

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('loads the note into the textarea', async () => {
    mockApi();
    const textarea = await openEditor();
    expect(mockFetch).toHaveBeenCalledWith('/api/notes/test/note');
    expect(textarea).toHaveValue('# Content');
  });

  it('returns to view mode when the note fails to load', async () => {
    mockApi({ load: { ok: false, text: '' } });
    const { NoteEditor } = await import('@/components/NoteEditor');
    render(React.createElement(NoteEditor, defaultProps));
    fireEvent.click(screen.getByText('Edit'));

    await vi.waitFor(() => {
      expect(screen.getByText('Page content')).toBeInTheDocument();
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('flashes saved, returns to view mode and refreshes after saving', async () => {
    mockApi();
    const textarea = await openEditor();
    fireEvent.change(textarea, { target: { value: '# Updated' } });
    fireEvent.click(screen.getByText('Save'));

    await vi.waitFor(() =>
      expect(screen.getByText('Saved')).toBeInTheDocument(),
    );
    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('/api/notes/test/note', {
      method: 'PUT',
      body: '# Updated',
      headers: { 'Content-Type': 'text/plain' },
    });
    await vi.waitFor(() => expect(mockRouterRefresh).toHaveBeenCalled());
  });

  it('stays in edit mode when saving fails', async () => {
    mockApi({ save: { ok: false } });
    const textarea = await openEditor();
    fireEvent.change(textarea, { target: { value: '# Updated' } });
    fireEvent.click(screen.getByText('Save'));

    await vi.waitFor(() => expect(console.error).toHaveBeenCalled());
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('saves with Cmd+S and Ctrl+S', async () => {
    mockApi();
    await openEditor();
    fireEvent.keyDown(window, { key: 's', metaKey: true });
    await vi.waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/notes/test/note',
        expect.objectContaining({ method: 'PUT' }),
      ),
    );

    mockFetch.mockClear();
    mockApi();
    fireEvent.click(await screen.findByText('Edit'));
    await vi.waitFor(() =>
      expect(screen.getByRole('textbox')).toBeInTheDocument(),
    );
    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    await vi.waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/notes/test/note',
        expect.objectContaining({ method: 'PUT' }),
      ),
    );
  });

  it('cancels immediately with Escape when there are no changes', async () => {
    mockApi();
    await openEditor();
    fireEvent.keyDown(window, { key: 'Escape' });
    await vi.waitFor(() =>
      expect(screen.getByText('Page content')).toBeInTheDocument(),
    );
  });

  it('cancels immediately with the Cancel button when there are no changes', async () => {
    mockApi();
    await openEditor();
    fireEvent.click(screen.getByText('Cancel'));
    await vi.waitFor(() =>
      expect(screen.getByText('Page content')).toBeInTheDocument(),
    );
  });

  it('asks before discarding, and Escape or Keep editing goes back to the editor', async () => {
    mockApi();
    const textarea = await openEditor();
    fireEvent.change(textarea, { target: { value: 'Changed' } });

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByText('Discard changes?')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    await vi.waitFor(() =>
      expect(screen.queryByText('Discard changes?')).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.click(screen.getByText('Keep editing'));
    await vi.waitFor(() =>
      expect(screen.queryByText('Discard changes?')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('textbox')).toHaveValue('Changed');
  });

  it('discards changes and returns to view mode', async () => {
    mockApi();
    const textarea = await openEditor();
    fireEvent.change(textarea, { target: { value: 'Changed' } });
    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.click(screen.getByText('Discard'));

    await vi.waitFor(() =>
      expect(screen.getByText('Page content')).toBeInTheDocument(),
    );
  });

  it('indents with two spaces at the cursor on Tab', async () => {
    mockApi({ load: { ok: true, text: 'ab' } });
    const textarea = await openEditor();
    textarea.setSelectionRange(1, 1);
    fireEvent.keyDown(textarea, { key: 'Tab' });

    expect(textarea).toHaveValue('a  b');
    await vi.waitFor(() => expect(textarea.selectionStart).toBe(3));
  });

  it('ignores other keys in the textarea', async () => {
    mockApi({ load: { ok: true, text: 'ab' } });
    const textarea = await openEditor();
    fireEvent.keyDown(textarea, { key: 'a' });
    expect(textarea).toHaveValue('ab');
    expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument();
  });

  it('renders the compiled preview after the debounce', async () => {
    mockApi();
    await openEditor();
    expect(screen.getByText('Compiling…')).toBeInTheDocument();

    await vi.waitFor(() =>
      expect(screen.getByTestId('mdx-preview')).toHaveTextContent(
        'compiled-code',
      ),
    );
    expect(mockFetch).toHaveBeenCalledWith('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '# Content' }),
    });
  });

  it('shows the error returned by the preview API', async () => {
    mockApi({ preview: { ok: false, body: { error: 'Bad MDX' } } });
    await openEditor();
    await vi.waitFor(() =>
      expect(screen.getByText('Bad MDX')).toBeInTheDocument(),
    );
  });

  it('shows a generic error when the preview API gives no message', async () => {
    mockApi({ preview: { ok: false, body: {} } });
    await openEditor();
    await vi.waitFor(() =>
      expect(screen.getByText('Preview failed')).toBeInTheDocument(),
    );
  });

  it('shows an error when the preview request fails', async () => {
    mockApi({ preview: 'reject' });
    await openEditor();
    await vi.waitFor(() =>
      expect(screen.getByText('Preview request failed')).toBeInTheDocument(),
    );
  });

  it('prompts to start typing when the note is empty', async () => {
    mockApi({ load: { ok: true, text: '   ' } });
    await openEditor();
    expect(screen.getByText('Start typing to see preview')).toBeInTheDocument();
  });
});
