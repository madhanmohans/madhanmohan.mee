'use client';

import { Check, Pencil, Save, X } from 'lucide-react';
import { AnimatePresence, m } from 'framer-motion';
import { InertWhileExiting } from '@/components/motion/InertWhileExiting';
import { fadeSwapTransition } from '@/components/motion/transitions';
import { ActionButton } from './ActionButton';
import { DiscardPrompt } from './DiscardPrompt';

export type EditorMode = 'view' | 'edit' | 'confirm-discard';

function SavedIndicator({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <m.span
          key="saved"
          className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Check className="size-3" />
          Saved
        </m.span>
      )}
    </AnimatePresence>
  );
}

export function NoteEditorToolbar({
  editorMode,
  isSaving,
  hasUnsavedChanges,
  showSavedFlash,
  onEdit,
  onSave,
  onCancel,
  onDiscard,
  onKeepEditing,
}: {
  editorMode: EditorMode;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  showSavedFlash: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDiscard: () => void;
  onKeepEditing: () => void;
}) {
  const isConfirmingDiscard = editorMode === 'confirm-discard';

  return (
    <div className="flex items-center gap-2 mb-4 min-h-8">
      <AnimatePresence mode="wait" initial={false}>
        {editorMode === 'view' ? (
          <m.div
            key="view-toolbar"
            className="flex items-center gap-2 ml-auto"
            {...fadeSwapTransition}
          >
            <InertWhileExiting>
              <SavedIndicator isVisible={showSavedFlash} />
              <ActionButton onClick={onEdit}>
                <Pencil />
                Edit
              </ActionButton>
            </InertWhileExiting>
          </m.div>
        ) : (
          <m.div
            key="edit-toolbar"
            className="flex items-center gap-2 w-full"
            {...fadeSwapTransition}
          >
            <InertWhileExiting>
              <ActionButton
                variant="primary"
                onClick={onSave}
                disabled={isSaving || !hasUnsavedChanges}
              >
                <Save />
                {isSaving ? 'Saving...' : 'Save'}
              </ActionButton>
              <ActionButton onClick={onCancel} disabled={isSaving}>
                <X />
                Cancel
              </ActionButton>

              <DiscardPrompt
                isOpen={isConfirmingDiscard}
                message="Discard changes?"
                onDiscard={onDiscard}
                onKeepEditing={onKeepEditing}
              />

              {hasUnsavedChanges && !isConfirmingDiscard && (
                <span className="text-xs text-fd-muted-foreground ml-2">
                  Unsaved changes
                </span>
              )}
              <span className="text-xs text-fd-muted-foreground ml-auto">
                ⌘S to save · Esc to cancel
              </span>
            </InertWhileExiting>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
