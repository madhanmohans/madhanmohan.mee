import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

// Runs the real copy callback on click so the clipboard and caching logic is exercised.
let isCopied = false;
let lastCopy: Promise<void> | undefined;
vi.mock('fumadocs-ui/utils/use-copy-button', () => ({
  useCopyButton: (onCopy: () => Promise<void>) => [
    isCopied,
    () => {
      lastCopy = onCopy();
      lastCopy.catch(() => {});
    },
  ],
}));

vi.mock('fumadocs-ui/components/ui/button', () => ({
  buttonVariants: () => 'btn',
}));

vi.mock('fumadocs-ui/components/ui/popover', () => ({
  Popover: ({ children }: any) => React.createElement('div', null, children),
  PopoverContent: ({ children }: any) =>
    React.createElement('div', null, children),
  PopoverTrigger: ({ children }: any) =>
    React.createElement('div', null, children),
}));

describe('CopyMarkdownButton copy behavior', () => {
  const clipboard = {
    write: vi.fn(async (items: any[]) => {
      await items[0].items['text/plain'];
    }),
    writeText: vi.fn(async () => {}),
  };
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    isCopied = false;
    Object.defineProperty(navigator, 'clipboard', {
      value: clipboard,
      configurable: true,
    });
    vi.stubGlobal(
      'ClipboardItem',
      class {
        constructor(public items: Record<string, Promise<string>>) {}
      },
    );
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue({ text: () => Promise.resolve('# Markdown') });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the markdown on first copy and reuses the cache afterwards', async () => {
    const { CopyMarkdownButton } =
      await import('@/components/page-actions/CopyMarkdownButton');
    render(<CopyMarkdownButton markdownUrl="/note/cached.mdx" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    await vi.waitFor(() => expect(clipboard.write).toHaveBeenCalled());
    await vi.waitFor(() => expect(button).not.toBeDisabled());
    expect(fetchMock).toHaveBeenCalledWith('/note/cached.mdx');

    fireEvent.click(button);
    await vi.waitFor(() =>
      expect(clipboard.writeText).toHaveBeenCalledWith('# Markdown'),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('re-enables the button when writing to the clipboard fails', async () => {
    clipboard.write.mockRejectedValueOnce(new Error('denied'));
    const { CopyMarkdownButton } =
      await import('@/components/page-actions/CopyMarkdownButton');
    render(<CopyMarkdownButton markdownUrl="/note/failing.mdx" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    await expect(lastCopy).rejects.toThrow('denied');
    await vi.waitFor(() => expect(button).not.toBeDisabled());
  });

  it('shows a check icon once copied', async () => {
    isCopied = true;
    const { CopyMarkdownButton } =
      await import('@/components/page-actions/CopyMarkdownButton');
    const { container } = render(<CopyMarkdownButton markdownUrl="/x.mdx" />);
    expect(container.querySelector('.lucide-check')).toBeInTheDocument();
  });
});

describe('OpenInAiMenu links', () => {
  it('builds prompts with the absolute markdown url', async () => {
    const { OpenInAiMenu } =
      await import('@/components/page-actions/OpenInAiMenu');
    render(<OpenInAiMenu markdownUrl="/note/test.mdx" />);

    const expectedPrompt = `Read ${window.location.origin}/note/test.mdx, I want to ask questions about it.`;
    await vi.waitFor(() => {
      const claudeLink = screen.getByText('Open in Claude').closest('a')!;
      expect(new URL(claudeLink.href).searchParams.get('q')).toBe(
        expectedPrompt,
      );
    });

    const chatGptLink = screen.getByText('Open in ChatGPT').closest('a')!;
    expect(new URL(chatGptLink.href).searchParams.get('hints')).toBe('search');
    const cursorLink = screen.getByText('Open in Cursor').closest('a')!;
    expect(new URL(cursorLink.href).searchParams.get('text')).toBe(
      expectedPrompt,
    );
  });
});
