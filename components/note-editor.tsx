'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Pencil, Save, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

type Mode = 'view' | 'edit' | 'confirm-discard';

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
  const [savedFlash, setSavedFlash] = useState(false);
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
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
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
    if (isDirty) {
      setMode('confirm-discard');
      return;
    }
    setMode('view');
    setIsDirty(false);
  }, [isDirty]);

  // Keyboard shortcuts
  useEffect(() => {
    if (mode !== 'edit' && mode !== 'confirm-discard') return;

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
      if (e.key === 'Escape') {
        if (mode === 'confirm-discard') {
          setMode('edit');
        } else {
          cancel();
        }
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

  const fadeProps = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.18, ease: 'easeOut' as const },
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 min-h-8">
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'view' && (
            <motion.div key="view-toolbar" className="flex items-center gap-2 ml-auto" {...fadeProps}>
              <AnimatePresence>
                {savedFlash && (
                  <motion.span
                    key="saved"
                    className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    <Check className="size-3" />
                    Saved
                  </motion.span>
                )}
              </AnimatePresence>
              <button
                onClick={enterEditMode}
                className={cn(
                  buttonVariants({
                    color: 'secondary',
                    size: 'sm',
                    className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground active:scale-95',
                  }),
                )}
              >
                <Pencil />
                Edit
              </button>
            </motion.div>
          )}

          {(mode === 'edit' || mode === 'confirm-discard') && (
            <motion.div key="edit-toolbar" className="flex items-center gap-2 w-full" {...fadeProps}>
              <button
                onClick={save}
                disabled={isSaving || !isDirty}
                className={cn(
                  buttonVariants({
                    color: 'primary',
                    size: 'sm',
                    className: 'gap-2 [&_svg]:size-3.5 active:scale-95',
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
                    className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground active:scale-95',
                  }),
                )}
              >
                <X />
                Cancel
              </button>

              <AnimatePresence>
                {mode === 'confirm-discard' && (
                  <motion.div
                    key="confirm"
                    className="flex items-center gap-2 ml-2"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    <span className="text-xs text-fd-muted-foreground">Discard changes?</span>
                    <button
                      onClick={() => { setMode('view'); setIsDirty(false); }}
                      className={cn(buttonVariants({ color: 'secondary', size: 'sm', className: 'gap-1 [&_svg]:size-3 text-red-500 active:scale-95' }))}
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => setMode('edit')}
                      className={cn(buttonVariants({ color: 'secondary', size: 'sm', className: 'active:scale-95' }))}
                    >
                      Keep editing
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {isDirty && mode !== 'confirm-discard' && (
                <span className="text-xs text-fd-muted-foreground ml-2">Unsaved changes</span>
              )}
              <span className="text-xs text-fd-muted-foreground ml-auto">
                ⌘S to save · Esc to cancel
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === 'view' ? (
          <motion.div key="view-content" {...fadeProps}>
            {children}
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center py-20 text-fd-muted-foreground gap-2"
            {...fadeProps}
          >
            <motion.div
              className="size-4 rounded-full border-2 border-fd-muted-foreground border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Loading…
          </motion.div>
        ) : (
          <motion.div key="editor" {...fadeProps}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
