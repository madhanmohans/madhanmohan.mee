import { useEffect } from 'react';

// ⌘S / Ctrl+S saves and Escape cancels while the editor is active
export function useEditorShortcuts({
  enabled = true,
  onSave,
  onEscape,
}: {
  enabled?: boolean;
  onSave: () => void;
  onEscape: () => void;
}) {
  useEffect(() => {
    if (!enabled) return;

    const keyboardShortcutHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }
      if (event.key === 'Escape') onEscape();
    };

    window.addEventListener('keydown', keyboardShortcutHandler);
    return () => window.removeEventListener('keydown', keyboardShortcutHandler);
  }, [enabled, onSave, onEscape]);
}
