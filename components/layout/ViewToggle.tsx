'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Waypoints, Notebook } from 'lucide-react';
import {
  GRAPH_URL,
  setViewPreference,
  viewUrl,
  type ViewPreference,
} from '@/lib/viewPreference';

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const graphView = pathname === GRAPH_URL;
  const noteView = pathname === viewUrl('notes');

  const select = (view: ViewPreference) => {
    setViewPreference(view);
    router.push(viewUrl(view));
  };

  return (
    <div
      className="flex border border-fd-border rounded-l"
      role="group"
      aria-label="Switch view"
      data-tour="view-toggle"
    >
      <button
        type="button"
        className="view-toggle-btn"
        data-active={noteView}
        aria-pressed={noteView}
        onClick={() => select('notes')}
      >
        <Notebook size={16} aria-hidden="true" />
        <span>notes</span>
      </button>
      <button
        type="button"
        className="view-toggle-btn"
        data-active={graphView}
        aria-pressed={graphView}
        onClick={() => select('graph')}
      >
        <Waypoints size={16} aria-hidden="true" />
        <span>graph</span>
      </button>
    </div>
  );
}
