import type React from 'react';

export function stripInlineMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1');
}

// Lightweight markdown renderer for node previews: headings, list items and
// plain lines, with inline formatting stripped
export function TooltipMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^---+$/.test(line.trim())) continue;

    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      const text = headingMatch[1]
        .replace(/==\*?([^=]+)==\*?/g, '$1')
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1');
      elements.push(
        <p
          key={i}
          className="font-semibold text-fd-foreground mt-1.5 first:mt-0 text-[11px] uppercase tracking-wider opacity-60"
        >
          {text}
        </p>,
      );
      continue;
    }

    const listMatch = line.match(/^[-*→]\s+(.+)/);
    if (listMatch) {
      elements.push(
        <div key={i} className="flex gap-1 items-start leading-snug">
          <span className="opacity-40 shrink-0">·</span>
          <span>{stripInlineMarkdown(listMatch[1])}</span>
        </div>,
      );
      continue;
    }

    if (line.trim()) {
      elements.push(
        <p key={i} className="leading-snug opacity-80">
          {stripInlineMarkdown(line)}
        </p>,
      );
    }
  }

  return <div className="flex flex-col gap-0.5">{elements}</div>;
}
