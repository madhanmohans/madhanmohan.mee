// Cross-fade for content swapped inside AnimatePresence mode="wait".
// Durations are halved because the exit and entrance play back to back.
export const fadeSwapTransition = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.1, ease: 'easeIn' as const },
  },
  transition: { duration: 0.1, ease: 'easeOut' as const },
};
