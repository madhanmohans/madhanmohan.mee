import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPreferredView,
  setPreferredView,
} from '@/components/layout/viewPreference';

describe('viewPreference', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('defaults to the notes view', () => {
    expect(getPreferredView()).toBe('notes');
  });

  it('round-trips the chosen view', () => {
    setPreferredView('graph');
    expect(getPreferredView()).toBe('graph');
    setPreferredView('notes');
    expect(getPreferredView()).toBe('notes');
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem('second-brain-view', 'timeline');
    expect(getPreferredView()).toBe('notes');
  });

  it('falls back to notes when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => setPreferredView('graph')).not.toThrow();
    expect(getPreferredView()).toBe('notes');
  });
});
