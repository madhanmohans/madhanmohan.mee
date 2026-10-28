'use client';

import { useIsPresent } from 'framer-motion';

// Blocks clicks and focus on content while its AnimatePresence parent exits
export function InertWhileExiting({ children }: { children: React.ReactNode }) {
  const isPresent = useIsPresent();
  return (
    <div className="contents" inert={!isPresent}>
      {children}
    </div>
  );
}
