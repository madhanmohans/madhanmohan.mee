'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { TOOLTIP_ANIMATION_DURATION } from './constants';
import { TooltipMarkdown } from './TooltipMarkdown';
import type { TooltipState } from './types';

export function GraphTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  return (
    <AnimatePresence>
      {tooltip && (
        <motion.div
          key="tooltip"
          className="absolute text-fd-popover-foreground p-3 border border-fd-border rounded-lg pointer-events-none w-64 overflow-hidden"
          style={{
            top: tooltip.y,
            left: tooltip.x,
            background: 'var(--color-fd-popover)',
            fontFamily: "'CommitMono', monospace",
            fontSize: '11px',
            letterSpacing: '0.01em',
            boxShadow:
              '0 1px 2px rgba(17,24,39,0.06), 0 4px 8px rgba(17,24,39,0.04), 0 12px 24px rgba(17,24,39,0.03)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: TOOLTIP_ANIMATION_DURATION,
            ease: 'easeOut',
          }}
        >
          <p className="font-semibold text-fd-foreground text-[12px] mb-2 border-b border-fd-border pb-1.5">
            {tooltip.title}
          </p>
          {tooltip.content && (
            <div className="text-fd-muted-foreground max-h-48 overflow-y-auto">
              <TooltipMarkdown content={tooltip.content} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
