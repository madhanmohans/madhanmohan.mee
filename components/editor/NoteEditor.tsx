'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, m } from 'framer-motion';
import { Spinner } from '@/components/motion/Spinner';
import { fadeSwapTransition } from '@/components/motion/transitions';
import { MarkdownEditor } from './MarkdownEditor';
import { NoteEditorToolbar, type EditorMode } from './NoteEditorToolbar';
import { fetchNoteSource, saveNoteSource } from './notesApi';
import { useEditorShortcuts } from './useEditorShortcuts';

const SAVED_FLASH_MS = 2000;
const REFRESH_AFTER_SAVE_MS = 500;

// Shows the rendered note and swaps it for a markdown editor on demand
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

  const startEditing = useCallback(async () => {
    setIsFetchingContent(true);
    setEditorMode('edit');
    try {
      setEditorContent(await fetchNoteSource(slug));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error(error);
      setEditorMode('view');
    } finally {
      setIsFetchingContent(false);
    }
  }, [slug]);

  const saveContent = useCallback(async () => {
    setIsSavingContent(true);
    try {
      await saveNoteSource(slug, editorContent);
      setHasUnsavedChanges(false);
      setShowSavedFlash(true);
      setTimeout(() => setShowSavedFlash(false), SAVED_FLASH_MS);
      setEditorMode('view');
      setTimeout(() => router.refresh(), REFRESH_AFTER_SAVE_MS);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingContent(false);
    }
  }, [slug, editorContent, router]);

  const discardChanges = useCallback(() => {
    setEditorMode('view');
    setHasUnsavedChanges(false);
  }, []);

  const cancelEditing = useCallback(() => {
    if (hasUnsavedChanges) setEditorMode('confirm-discard');
    else discardChanges();
  }, [hasUnsavedChanges, discardChanges]);

  const handleEscape = useCallback(() => {
    if (editorMode === 'confirm-discard') setEditorMode('edit');
    else cancelEditing();
  }, [editorMode, cancelEditing]);

  useEditorShortcuts({
    enabled: editorMode !== 'view',
    onSave: saveContent,
    onEscape: handleEscape,
  });

  return (
    <div>
      <NoteEditorToolbar
        editorMode={editorMode}
        isSaving={isSavingContent}
        hasUnsavedChanges={hasUnsavedChanges}
        showSavedFlash={showSavedFlash}
        onEdit={startEditing}
        onSave={saveContent}
        onCancel={cancelEditing}
        onDiscard={discardChanges}
        onKeepEditing={() => setEditorMode('edit')}
      />

      <AnimatePresence mode="wait" initial={false}>
        {editorMode === 'view' ? (
          <m.div key="view-content" {...fadeSwapTransition}>
            {children}
          </m.div>
        ) : isFetchingContent ? (
          <m.div
            key="loading"
            className="flex items-center justify-center py-20 text-fd-muted-foreground gap-2"
            {...fadeSwapTransition}
          >
            <Spinner className="size-4" />
            Loading…
          </m.div>
        ) : (
          <m.div key="editor" {...fadeSwapTransition}>
            <MarkdownEditor
              value={editorContent}
              onChange={(updatedContent) => {
                setEditorContent(updatedContent);
                setHasUnsavedChanges(true);
              }}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
