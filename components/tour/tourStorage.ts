function getTourStorageKey(tourId: string): string {
  return `site-tour-${tourId}-done`;
}

export function isTourAlreadyCompleted(tourId: string): boolean {
  try {
    return !!localStorage.getItem(getTourStorageKey(tourId));
  } catch {
    return false;
  }
}

export function markTourCompleted(tourId: string): void {
  try {
    localStorage.setItem(getTourStorageKey(tourId), '1');
  } catch {
    // Silently fail if localStorage is unavailable (e.g. private browsing)
  }
}
