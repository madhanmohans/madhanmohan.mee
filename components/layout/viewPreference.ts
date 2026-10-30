import { NOTES_BASE_URL } from '@/app/constants';

export type SecondBrainView = 'notes' | 'graph';

export const DEFAULT_VIEW: SecondBrainView = 'notes';

export const VIEW_PATHS: Record<SecondBrainView, string> = {
  notes: NOTES_BASE_URL,
  graph: '/graph',
};

const VIEW_STORAGE_KEY = 'second-brain-view';

export function getPreferredView(): SecondBrainView {
  try {
    return localStorage.getItem(VIEW_STORAGE_KEY) === 'graph'
      ? 'graph'
      : DEFAULT_VIEW;
  } catch {
    return DEFAULT_VIEW;
  }
}

export function setPreferredView(view: SecondBrainView): void {
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, view);
  } catch {
    // Silently fail if localStorage is unavailable (e.g. private browsing)
  }
}
