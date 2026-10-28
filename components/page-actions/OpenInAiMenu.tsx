'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { buildAiPlatformLinks } from './aiPlatformLinks';

// "Open" dropdown that hands the page's markdown to an AI chat
export function OpenInAiMenu({ markdownUrl }: { markdownUrl: string }) {
  const [windowOrigin, setWindowOrigin] = useState('');

  useEffect(() => {
    setWindowOrigin(window.location.origin);
  }, []);

  const platformLinks = useMemo(() => {
    const absoluteMarkdownUrl = windowOrigin
      ? new URL(markdownUrl, windowOrigin).toString()
      : markdownUrl;
    return buildAiPlatformLinks(absoluteMarkdownUrl);
  }, [markdownUrl, windowOrigin]);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({
            color: 'secondary',
            size: 'sm',
            className: 'gap-2',
          }),
        )}
      >
        Open
        <ChevronDown className="size-3.5 text-fd-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col">
        {platformLinks.map((linkItem) => (
          <a
            key={linkItem.href}
            href={linkItem.href}
            rel="noreferrer noopener"
            target="_blank"
            className="text-sm p-2 rounded-lg inline-flex items-center gap-2 hover:text-fd-accent-foreground hover:bg-fd-accent [&_svg]:size-4"
          >
            {linkItem.icon}
            {linkItem.title}
            <ExternalLinkIcon className="text-fd-muted-foreground size-3.5 ms-auto" />
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
}
