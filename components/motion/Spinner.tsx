'use client';

import { m } from 'framer-motion';
import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <m.div
      className={cn(
        'rounded-full border-2 border-fd-muted-foreground border-t-transparent',
        className,
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}
