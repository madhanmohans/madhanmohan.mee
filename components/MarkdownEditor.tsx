'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MdxPreview } from '@/components/MDXPreview';

const PREVIEW_DEBOUNCE_MS = 500;

// Side-by-side markdown textarea and live MDX preview, shared by the
// note editor and the new-note page
export function MarkdownEditor({
  value,
  onChange,
  autoFocus = true,
}: {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  const [previewCompiled, setPreviewCompiled] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) editorTextareaRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!value.trim()) {
      setPreviewCompiled('');
      setPreviewError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);
      try {
        const res = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: value }),
        });
        const data = await res.json();
        if (res.ok) {
          setPreviewCompiled(data.compiled);
        } else {
          setPreviewError(data.error ?? 'Preview failed');
        }
      } catch {
        setPreviewError('Preview request failed');
      } finally {
        setIsPreviewLoading(false);
      }
    }, PREVIEW_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value]);

  const handleTabKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const cursorStart = textarea.selectionStart;
      const cursorEnd = textarea.selectionEnd;
      onChange(
        value.substring(0, cursorStart) + '  ' + value.substring(cursorEnd),
      );
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorStart + 2;
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[70vh]">
      <div className="flex flex-col min-h-[50vh]">
        <div className="text-xs text-fd-muted-foreground mb-1.5 font-medium">
          Editor
        </div>
        <textarea
          ref={editorTextareaRef}
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
      <div className="flex flex-col min-h-[50vh]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-fd-muted-foreground font-medium">
            Preview
          </span>
          {isPreviewLoading && (
            <motion.div
              className="size-3 rounded-full border-2 border-fd-muted-foreground border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </div>
        <div className="flex-1 w-full overflow-y-auto rounded-lg border border-fd-border bg-fd-card p-4">
          {previewError ? (
            <div className="text-red-500 text-xs whitespace-pre-wrap font-mono">
              {previewError}
            </div>
          ) : previewCompiled ? (
            <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:overflow-x-auto [&_code]:text-sm">
              <MdxPreview compiled={previewCompiled} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-fd-muted-foreground">
              {value.trim() ? 'Compiling…' : 'Start typing to see preview'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
