'use client';

import { Hash, Plus } from 'lucide-react';
import { m } from 'framer-motion';

export const chipTransition = { duration: 0.15, ease: 'easeOut' as const };

export function TagChip({
  tag,
  variant = 'applied',
  onClick,
  action,
}: {
  tag: string;
  variant?: 'applied' | 'suggested';
  onClick?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <m.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={chipTransition}
      className="note-tag"
      data-variant={variant}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className="inline-flex items-center gap-1"
        aria-label={variant === 'suggested' ? `Add tag ${tag}` : undefined}
      >
        {variant === 'suggested' ? (
          <Plus className="size-3" />
        ) : (
          <Hash className="size-3 opacity-50" />
        )}
        {tag}
      </button>
      {action}
    </m.span>
  );
}
