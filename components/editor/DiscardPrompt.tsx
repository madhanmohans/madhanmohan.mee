'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { InertWhileExiting } from '@/components/motion/InertWhileExiting';
import { ActionButton } from './ActionButton';

// Inline "discard?" confirmation that slides in next to the editor toolbar
export function DiscardPrompt({
  isOpen,
  message,
  onDiscard,
  onKeepEditing,
}: {
  isOpen: boolean;
  message: string;
  onDiscard: () => void;
  onKeepEditing: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
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
            <span className="text-xs text-fd-muted-foreground">{message}</span>
            <ActionButton variant="destructive" onClick={onDiscard}>
              Discard
            </ActionButton>
            <ActionButton variant="plain" onClick={onKeepEditing}>
              Keep editing
            </ActionButton>
          </InertWhileExiting>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
