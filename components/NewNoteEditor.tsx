'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { cn } from '@/lib/cn';
import { slugify } from '@/lib/slugify';
import { NOTES_BASE_URL } from '@/app/constants';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { InertWhileExiting } from '@/components/Motion';

const PAGE_READY_POLL_MS = 300;
const PAGE_READY_TIMEOUT_MS = 10_000;

// The dev server picks up new files asynchronously, so wait until the
// note resolves before navigating to it
async function waitForNote(slug: string) {
  const deadline = Date.now() + PAGE_READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const apiResponse = await fetch(`/api/notes/${slug}`).catch(() => null);
    if (apiResponse?.ok) return;
    await new Promise((resolve) => setTimeout(resolve, PAGE_READY_POLL_MS));
  }
}

export function NewNoteEditor() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isConfirmingDiscard, setIsConfirmingDiscard] = useState(false);

  const slug = slugify(title);
  const hasUnsavedChanges = Boolean(title.trim() || editorContent.trim());

  const createNote = useCallback(async () => {
    if (!slug || isCreating) return;
    setIsCreating(true);
    setCreateError(null);
    try {
      const apiResponse = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: editorContent }),
      });
      const data = await apiResponse.json();
      if (!apiResponse.ok) throw new Error(data.error ?? 'Failed to create');
      await waitForNote(data.slug);
      router.push(data.url);
      router.refresh();
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Failed');
      setIsCreating(false);
    }
  }, [slug, isCreating, title, editorContent, router]);

  const leave = useCallback(() => {
    if (window.history.length > 1) router.back();
    else router.push(NOTES_BASE_URL);
  }, [router]);

  const cancelCreating = useCallback(() => {
    if (hasUnsavedChanges) {
      setIsConfirmingDiscard(true);
      return;
    }
    leave();
  }, [hasUnsavedChanges, leave]);

  useEffect(() => {
    const keyboardShortcutHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        createNote();
      }
      if (event.key === 'Escape') {
        if (isConfirmingDiscard) setIsConfirmingDiscard(false);
        else cancelCreating();
      }
    };

    window.addEventListener('keydown', keyboardShortcutHandler);
    return () => window.removeEventListener('keydown', keyboardShortcutHandler);
  }, [createNote, cancelCreating, isConfirmingDiscard]);

  return (
    <div>
      <input
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          setCreateError(null);
        }}
        autoFocus
        placeholder="Note title"
        aria-label="Note title"
        className="w-full bg-transparent text-3xl font-semibold text-fd-foreground placeholder:text-fd-muted-foreground/60 focus:outline-none"
      />
      <div className="text-xs text-fd-muted-foreground mt-1 mb-4 font-mono">
        content/docs/{slug || '…'}.md
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 min-h-8">
        <button
          onClick={createNote}
          disabled={isCreating || !slug}
          className={cn(
            buttonVariants({
              color: 'primary',
              size: 'sm',
              className: 'gap-2 [&_svg]:size-3.5 active:scale-95',
            }),
          )}
        >
          <Plus />
          {isCreating ? 'Creating...' : 'Create'}
        </button>
        <button
          onClick={cancelCreating}
          disabled={isCreating}
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'sm',
              className:
                'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground active:scale-95',
            }),
          )}
        >
          <X />
          Cancel
        </button>

        <AnimatePresence>
          {isConfirmingDiscard && (
            <motion.div
              key="confirm"
              className="flex items-center gap-2 ml-2"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -6,
                transition: { duration: 0.15, ease: 'easeIn' },
              }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <InertWhileExiting>
                <span className="text-xs text-fd-muted-foreground">
                  Discard note?
                </span>
                <button
                  onClick={leave}
                  className={cn(
                    buttonVariants({
                      color: 'secondary',
                      size: 'sm',
                      className:
                        'gap-1 [&_svg]:size-3 text-red-500 active:scale-95',
                    }),
                  )}
                >
                  Discard
                </button>
                <button
                  onClick={() => setIsConfirmingDiscard(false)}
                  className={cn(
                    buttonVariants({
                      color: 'secondary',
                      size: 'sm',
                      className: 'active:scale-95',
                    }),
                  )}
                >
                  Keep editing
                </button>
              </InertWhileExiting>
            </motion.div>
          )}
        </AnimatePresence>

        {createError && !isConfirmingDiscard && (
          <span className="text-xs text-red-500 ml-2">{createError}</span>
        )}
        <span className="text-xs text-fd-muted-foreground ml-auto">
          ⌘S to create · Esc to cancel
        </span>
      </div>

      <MarkdownEditor
        value={editorContent}
        onChange={setEditorContent}
        autoFocus={false}
      />
    </div>
  );
}
