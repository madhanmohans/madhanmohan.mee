'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Pencil, Save, X } from 'lucide-react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { InertWhileExiting } from '@/components/Motion';

type EditorMode = 'view' | 'edit' | 'confirm-discard';

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

  // Halved durations: mode="wait" plays the exit and entrance back to back
  const fadeTransitionProps = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: {
      opacity: 0,
      y: -4,
      transition: { duration: 0.1, ease: 'easeIn' as const },
    },
    transition: { duration: 0.1, ease: 'easeOut' as const },
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
              <InertWhileExiting>
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
              </InertWhileExiting>
            </motion.div>
          )}

          {(editorMode === 'edit' || editorMode === 'confirm-discard') && (
            <motion.div
              key="edit-toolbar"
              className="flex items-center gap-2 w-full"
              {...fadeTransitionProps}
            >
              <InertWhileExiting>
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
                      exit={{
                        opacity: 0,
                        x: -6,
                        transition: { duration: 0.15, ease: 'easeIn' },
                      }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                      <InertWhileExiting>
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
                      </InertWhileExiting>
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
              </InertWhileExiting>
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
          <motion.div key="editor" {...fadeTransitionProps}>
            <MarkdownEditor
              value={editorContent}
              onChange={(updatedContent) => {
                setEditorContent(updatedContent);
                setHasUnsavedChanges(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
