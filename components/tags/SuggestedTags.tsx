'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { TagChip, chipTransition } from './TagChip';

// Row of AI-suggested tags the user can accept one by one or all at once
export function SuggestedTags({
  tags,
  onAdd,
  onDismiss,
}: {
  tags: string[];
  onAdd: (tags: string[]) => void;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence initial={false}>
      {tags.length > 0 && (
        <motion.div
          key="suggestions"
          className="flex flex-wrap items-center gap-1.5"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={chipTransition}
        >
          <span className="text-xs text-fd-muted-foreground">Suggested</span>
          <AnimatePresence initial={false}>
            {tags.map((tag) => (
              <TagChip
                key={tag}
                tag={tag}
                variant="suggested"
                onClick={() => onAdd([tag])}
              />
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => onAdd(tags)}
            className="text-xs text-fd-muted-foreground hover:text-fd-foreground"
          >
            Add all
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs text-fd-muted-foreground hover:text-fd-foreground"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
