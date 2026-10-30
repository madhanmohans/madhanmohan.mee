'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Waypoints, Notebook } from 'lucide-react';
import { NOTES_BASE_URL } from '@/app/constants';
import {
  VIEW_PATHS,
  setPreferredView,
  type SecondBrainView,
} from './viewPreference';

const VIEWS: { view: SecondBrainView; label: string; icon: LucideIcon }[] = [
  { view: 'notes', label: 'notes', icon: Notebook },
  { view: 'graph', label: 'graph', icon: Waypoints },
];

function isViewActive(view: SecondBrainView, pathname: string): boolean {
  if (view === 'graph') return pathname === VIEW_PATHS.graph;
  return (
    pathname === NOTES_BASE_URL || pathname.startsWith(`${NOTES_BASE_URL}/`)
  );
}

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className="view-toggle"
      role="group"
      aria-label="Switch view"
      data-tour="view-toggle"
    >
      {VIEWS.map(({ view, label, icon: Icon }) => {
        const active = isViewActive(view, pathname);
        return (
          <button
            key={view}
            type="button"
            className="view-toggle-btn"
            data-active={active}
            aria-pressed={active}
            onClick={() => {
              setPreferredView(view);
              if (!active) router.push(VIEW_PATHS[view]);
            }}
          >
            <Icon size={14} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
