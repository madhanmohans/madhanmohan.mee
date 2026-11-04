import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  VIEW_PREFERENCE_KEY,
  getViewPreference,
  setViewPreference,
  viewUrl,
} from '@/lib/viewPreference';

describe('viewPreference', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('defaults to notes', () => {
    expect(getViewPreference()).toBe('notes');
  });

  it('round-trips a stored view', () => {
    setViewPreference('graph');
    expect(getViewPreference()).toBe('graph');
  });

  it('ignores invalid stored values', () => {
    window.localStorage.setItem(VIEW_PREFERENCE_KEY, 'bogus');
    expect(getViewPreference()).toBe('notes');
  });

  it('survives storage errors', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(getViewPreference()).toBe('notes');
    expect(() => setViewPreference('graph')).not.toThrow();
  });

  it('maps views to urls', () => {
    expect(viewUrl('notes')).toBe('/note');
    expect(viewUrl('graph')).toBe('/graph');
  });
});
