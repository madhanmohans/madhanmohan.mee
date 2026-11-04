import { NOTES_BASE_URL } from '@/app/constants';

export type ViewPreference = 'notes' | 'graph';

export const VIEW_PREFERENCE_KEY = 'view-preference';
export const DEFAULT_VIEW: ViewPreference = 'notes';
export const GRAPH_URL = '/graph';

export function viewUrl(view: ViewPreference): string {
  return view === 'graph' ? GRAPH_URL : NOTES_BASE_URL;
}

// Storage can be missing or throw (private windows, blocked site data)
export function getViewPreference(): ViewPreference {
  try {
    const stored = window.localStorage.getItem(VIEW_PREFERENCE_KEY);
    return stored === 'graph' || stored === 'notes' ? stored : DEFAULT_VIEW;
  } catch {
    return DEFAULT_VIEW;
  }
}

export function setViewPreference(view: ViewPreference): void {
  try {
    window.localStorage.setItem(VIEW_PREFERENCE_KEY, view);
  } catch {
    // preference is a convenience; ignore storage failures
  }
}
