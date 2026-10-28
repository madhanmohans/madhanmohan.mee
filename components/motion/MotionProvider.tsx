'use client';

import { MotionConfig } from 'framer-motion';

// Skips transform animations for users who prefer reduced motion
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
