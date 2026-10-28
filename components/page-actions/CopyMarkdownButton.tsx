'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

const markdownContentCache = new Map<string, string>();

// Copies the page's raw markdown, fetching it lazily on first click
export function CopyMarkdownButton({ markdownUrl }: { markdownUrl: string }) {
  const [isFetchingMarkdown, setIsFetchingMarkdown] = useState(false);
  const [isCopied, handleCopyClick] = useCopyButton(async () => {
    const cachedContent = markdownContentCache.get(markdownUrl);
    if (cachedContent) return navigator.clipboard.writeText(cachedContent);

    setIsFetchingMarkdown(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': fetch(markdownUrl).then(async (response) => {
            const markdownContent = await response.text();
            markdownContentCache.set(markdownUrl, markdownContent);
            return markdownContent;
          }),
        }),
      ]);
    } finally {
      setIsFetchingMarkdown(false);
    }
  });

  return (
    <button
      disabled={isFetchingMarkdown}
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'sm',
          className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
        }),
      )}
      onClick={handleCopyClick}
    >
      {isCopied ? <Check /> : <Copy />}
      Copy Markdown
    </button>
  );
}
