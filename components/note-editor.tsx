'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Save, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

type Mode = 'view' | 'edit';

export function NoteEditor({
  slug,
  children,
}: {
  slug: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('view');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const apiUrl = `/api/notes/${slug.join('/')}`;

  const enterEditMode = useCallback(async () => {
    setIsLoading(true);
    setMode('edit');
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to load note');
      const text = await res.text();
      setContent(text);
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      setMode('view');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch(apiUrl, {
        method: 'PUT',
        body: content,
        headers: { 'Content-Type': 'text/plain' },
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsDirty(false);
      setMode('view');
      // Small delay for fumadocs-mdx to recompile before refreshing
      setTimeout(() => router.refresh(), 500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }, [apiUrl, content, router]);

  const cancel = useCallback(() => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return;
    setMode('view');
    setIsDirty(false);
  }, [isDirty]);

  // Keyboard shortcuts
  useEffect(() => {
    if (mode !== 'edit') return;

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
      if (e.key === 'Escape') {
        cancel();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mode, save, cancel]);

  // Auto-focus textarea when entering edit mode
  useEffect(() => {
    if (mode === 'edit' && !isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode, isLoading]);

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newValue);
      setIsDirty(true);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  if (mode === 'view') {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={enterEditMode}
            className={cn(
              buttonVariants({
                color: 'secondary',
                size: 'sm',
                className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
              }),
            )}
          >
            <Pencil />
            Edit
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={save}
          disabled={isSaving || !isDirty}
          className={cn(
            buttonVariants({
              color: 'primary',
              size: 'sm',
              className: 'gap-2 [&_svg]:size-3.5',
            }),
          )}
        >
          <Save />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={cancel}
          disabled={isSaving}
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'sm',
              className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
            }),
          )}
        >
          <X />
          Cancel
        </button>
        {isDirty && (
          <span className="text-xs text-fd-muted-foreground ml-2">Unsaved changes</span>
        )}
        <span className="text-xs text-fd-muted-foreground ml-auto">
          Ctrl+S to save · Esc to cancel
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-fd-muted-foreground">
          Loading...
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsDirty(true);
          }}
          onKeyDown={handleTabKey}
          spellCheck={false}
          className="w-full min-h-[70vh] p-4 rounded-lg border border-fd-border bg-fd-card text-fd-foreground font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-fd-ring"
          style={{ tabSize: 2 }}
        />
      )}
    </div>
  );
}
