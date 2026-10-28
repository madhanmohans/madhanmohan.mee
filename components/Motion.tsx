'use client';

import { MotionConfig, useIsPresent } from 'framer-motion';

// Skips transform animations for users who prefer reduced motion
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// Blocks clicks and focus on content while its AnimatePresence parent exits
export function InertWhileExiting({ children }: { children: React.ReactNode }) {
  const isPresent = useIsPresent();
  return (
    <div className="contents" inert={!isPresent}>
      {children}
    </div>
  );
}
