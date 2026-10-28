'use client';

import { useEffect, useRef } from 'react';

const INDENT = '  ';

// Markdown textarea that inserts spaces on Tab instead of moving focus
export function SourcePane({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  autoFocus: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const handleTabKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const textarea = event.currentTarget;
    const cursorStart = textarea.selectionStart;
    const cursorEnd = textarea.selectionEnd;
    onChange(
      value.substring(0, cursorStart) + INDENT + value.substring(cursorEnd),
    );
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd =
        cursorStart + INDENT.length;
    });
  };

  return (
    <div className="flex flex-col min-h-[50vh]">
      <div className="text-xs text-fd-muted-foreground mb-1.5 font-medium">
        Editor
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleTabKey}
        spellCheck={false}
        className="flex-1 w-full p-4 rounded-lg border border-fd-border bg-fd-card text-fd-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-fd-ring"
        style={{ tabSize: 2 }}
      />
      <div className="text-xs text-fd-muted-foreground mt-1">
        {value.split('\n').length} lines
      </div>
    </div>
  );
}
