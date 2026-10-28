'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Waypoints, Notebook } from 'lucide-react';
import { NOTES_BASE_URL } from '@/app/constants';

export function ViewToggle() {
  const router = useRouter();
  const graphView = usePathname() === '/graph';
  const noteView = usePathname() === NOTES_BASE_URL;

  return (
    <div
      className="flex border border-fd-border rounded-l"
      data-tour="view-toggle"
    >
      <button
        className="view-toggle-btn"
        data-active={graphView}
        aria-label="Graph view"
        aria-pressed={graphView}
        onClick={() => router.push('/graph')}
      >
        <Waypoints size={16} />
      </button>
      <button
        className="view-toggle-btn"
        data-active={noteView}
        aria-label="Notes view"
        aria-pressed={noteView}
        onClick={() => router.push(NOTES_BASE_URL)}
      >
        <Notebook size={16} />
      </button>
    </div>
  );
}
