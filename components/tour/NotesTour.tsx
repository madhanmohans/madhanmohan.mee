'use client';

import dynamic from 'next/dynamic';
import type { TourStep } from './types';

const Tour = dynamic(
  () => import('@/components/tour/Tour').then((module) => module.Tour),
  { ssr: false },
);

const NOTES_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'docs.',
    body: 'notes and ideas in long form. use the sidebar to navigate between topics.',
    placement: 'center',
  },
  {
    id: 'sidebar',
    title: 'sidebar',
    body: 'all notes, organized by topic. click any entry to navigate to it.',
    selector: 'aside',
    placement: 'center',
  },
  {
    id: 'llm-actions',
    title: 'export',
    body: 'copy this note as markdown or open it directly in Claude, ChatGPT, Cursor, or Scira.',
    selector: '[data-tour="llm-actions"]',
    placement: 'bottom',
  },
  {
    id: 'graph-mini',
    title: 'local graph',
    body: 'a minimap of how this note connects to others in the second brain.',
    selector: '[data-tour="graph-mini"]',
    placement: 'top',
  },
];

// Tour shown on note pages. The "docs" id keeps existing completion state.
export function NotesTour() {
  return <Tour id="docs" steps={NOTES_TOUR_STEPS} />;
}
