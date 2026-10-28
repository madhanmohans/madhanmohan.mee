'use client';

import { LazyMotion, MotionConfig } from 'framer-motion';

const loadFeatures = () => import('./features').then((mod) => mod.default);

// Skips transform animations for users who prefer reduced motion.
// Animation features load after hydration; `strict` rejects `motion.*`
// so components use the lightweight `m.*` instead.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
