'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Pencil, Save, X } from 'lucide-react';
import { MdxPreview } from '@/components/MDXPreview';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

type EditorMode = 'view' | 'edit' | 'confirm-discard';

const PREVIEW_DEBOUNCE_MS = 500;

export function NoteEditor({
  slug,
  children,
}: {
  slug: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [editorMode, setEditorMode] = useState<EditorMode>('view');
  const [editorContent, setEditorContent] = useState('');
  const [isFetchingContent, setIsFetchingContent] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedFlash, setShowSavedFlash] = useState(false);
  const [previewCompiled, setPreviewCompiled] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);

  const noteApiUrl = `/api/notes/${slug.join('/')}`;

  const startEditing = useCallback(async () => {
    setIsFetchingContent(true);
    setEditorMode('edit');
    try {
      const apiResponse = await fetch(noteApiUrl);
      if (!apiResponse.ok) throw new Error('Failed to load note');
      const fetchedContent = await apiResponse.text();
      setEditorContent(fetchedContent);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error(error);
      setEditorMode('view');
    } finally {
      setIsFetchingContent(false);
    }
  }, [noteApiUrl]);

  const saveContent = useCallback(async () => {
    setIsSavingContent(true);
    try {
      const apiResponse = await fetch(noteApiUrl, {
        method: 'PUT',
        body: editorContent,
        headers: { 'Content-Type': 'text/plain' },
      });
      if (!apiResponse.ok) throw new Error('Failed to save');
      setHasUnsavedChanges(false);
      setShowSavedFlash(true);
      setTimeout(() => setShowSavedFlash(false), 2000);
      setEditorMode('view');
      setTimeout(() => router.refresh(), 500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingContent(false);
    }
  }, [noteApiUrl, editorContent, router]);

  const cancelEditing = useCallback(() => {
    if (hasUnsavedChanges) {
      setEditorMode('confirm-discard');
      return;
    }
    setEditorMode('view');
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (editorMode !== 'edit' && editorMode !== 'confirm-discard') return;

    const keyboardShortcutHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        saveContent();
      }
      if (event.key === 'Escape') {
        if (editorMode === 'confirm-discard') {
          setEditorMode('edit');
        } else {
          cancelEditing();
        }
      }
    };

    window.addEventListener('keydown', keyboardShortcutHandler);
    return () => window.removeEventListener('keydown', keyboardShortcutHandler);
  }, [editorMode, saveContent, cancelEditing]);

  useEffect(() => {
    if (
      editorMode === 'edit' &&
      !isFetchingContent &&
      editorTextareaRef.current
    ) {
      editorTextareaRef.current.focus();
    }
  }, [editorMode, isFetchingContent]);

  useEffect(() => {
    if (editorMode !== 'edit') {
      setPreviewCompiled('');
      setPreviewError(null);
      return;
    }

    if (!editorContent.trim()) {
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
          body: JSON.stringify({ content: editorContent }),
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
  }, [editorContent, editorMode]);

  const handleTabKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const cursorStart = textarea.selectionStart;
      const cursorEnd = textarea.selectionEnd;
      const updatedContent =
        editorContent.substring(0, cursorStart) +
        '  ' +
        editorContent.substring(cursorEnd);
      setEditorContent(updatedContent);
      setHasUnsavedChanges(true);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorStart + 2;
      });
    }
  };

  const fadeTransitionProps = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.18, ease: 'easeOut' as const },
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 min-h-8">
        <AnimatePresence mode="wait" initial={false}>
          {editorMode === 'view' && (
            <motion.div
              key="view-toolbar"
              className="flex items-center gap-2 ml-auto"
              {...fadeTransitionProps}
            >
              <AnimatePresence>
                {showSavedFlash && (
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
                onClick={startEditing}
                className={cn(
                  buttonVariants({
                    color: 'secondary',
                    size: 'sm',
                    className:
                      'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground active:scale-95',
                  }),
                )}
              >
                <Pencil />
                Edit
              </button>
            </motion.div>
          )}

          {(editorMode === 'edit' || editorMode === 'confirm-discard') && (
            <motion.div
              key="edit-toolbar"
              className="flex items-center gap-2 w-full"
              {...fadeTransitionProps}
            >
              <button
                onClick={saveContent}
                disabled={isSavingContent || !hasUnsavedChanges}
                className={cn(
                  buttonVariants({
                    color: 'primary',
                    size: 'sm',
                    className: 'gap-2 [&_svg]:size-3.5 active:scale-95',
                  }),
                )}
              >
                <Save />
                {isSavingContent ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={cancelEditing}
                disabled={isSavingContent}
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
                {editorMode === 'confirm-discard' && (
                  <motion.div
                    key="confirm"
                    className="flex items-center gap-2 ml-2"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    <span className="text-xs text-fd-muted-foreground">
                      Discard changes?
                    </span>
                    <button
                      onClick={() => {
                        setEditorMode('view');
                        setHasUnsavedChanges(false);
                      }}
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
                      onClick={() => setEditorMode('edit')}
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
                  </motion.div>
                )}
              </AnimatePresence>

              {hasUnsavedChanges && editorMode !== 'confirm-discard' && (
                <span className="text-xs text-fd-muted-foreground ml-2">
                  Unsaved changes
                </span>
              )}
              <span className="text-xs text-fd-muted-foreground ml-auto">
                ⌘S to save · Esc to cancel
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {editorMode === 'view' ? (
          <motion.div key="view-content" {...fadeTransitionProps}>
            {children}
          </motion.div>
        ) : isFetchingContent ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center py-20 text-fd-muted-foreground gap-2"
            {...fadeTransitionProps}
          >
            <motion.div
              className="size-4 rounded-full border-2 border-fd-muted-foreground border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Loading…
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            className="grid grid-cols-2 gap-4 min-h-[70vh]"
            {...fadeTransitionProps}
          >
            <div className="flex flex-col">
              <div className="text-xs text-fd-muted-foreground mb-1.5 font-medium">
                Editor
              </div>
              <textarea
                ref={editorTextareaRef}
                value={editorContent}
                onChange={(event) => {
                  setEditorContent(event.target.value);
                  setHasUnsavedChanges(true);
                }}
                onKeyDown={handleTabKey}
                spellCheck={false}
                className="flex-1 w-full p-4 rounded-lg border border-fd-border bg-fd-card text-fd-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-fd-ring"
                style={{ tabSize: 2 }}
              />
              <div className="text-xs text-fd-muted-foreground mt-1">
                {editorContent.split('\n').length} lines
              </div>
            </div>
            <div className="flex flex-col">
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
                    {editorContent.trim()
                      ? 'Compiling…'
                      : 'Start typing to see preview'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
