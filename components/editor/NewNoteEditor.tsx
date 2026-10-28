'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { slugify } from '@/lib/slugify';
import { NOTES_BASE_URL } from '@/app/constants';
import { ActionButton } from './ActionButton';
import { DiscardPrompt } from './DiscardPrompt';
import { MarkdownEditor } from './MarkdownEditor';
import { createNote, waitForNote } from './notesApi';
import { useEditorShortcuts } from './useEditorShortcuts';

export function NewNoteEditor() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isConfirmingDiscard, setIsConfirmingDiscard] = useState(false);

  const slug = slugify(title);
  const hasUnsavedChanges = Boolean(title.trim() || editorContent.trim());

  const submitNote = useCallback(async () => {
    if (!slug || isCreating) return;
    setIsCreating(true);
    setCreateError(null);
    try {
      const createdNote = await createNote(title, editorContent);
      await waitForNote(createdNote.slug);
      router.push(createdNote.url);
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
    if (hasUnsavedChanges) setIsConfirmingDiscard(true);
    else leave();
  }, [hasUnsavedChanges, leave]);

  const handleEscape = useCallback(() => {
    if (isConfirmingDiscard) setIsConfirmingDiscard(false);
    else cancelCreating();
  }, [isConfirmingDiscard, cancelCreating]);

  useEditorShortcuts({ onSave: submitNote, onEscape: handleEscape });

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
        <ActionButton
          variant="primary"
          onClick={submitNote}
          disabled={isCreating || !slug}
        >
          <Plus />
          {isCreating ? 'Creating...' : 'Create'}
        </ActionButton>
        <ActionButton onClick={cancelCreating} disabled={isCreating}>
          <X />
          Cancel
        </ActionButton>

        <DiscardPrompt
          isOpen={isConfirmingDiscard}
          message="Discard note?"
          onDiscard={leave}
          onKeepEditing={() => setIsConfirmingDiscard(false)}
        />

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
