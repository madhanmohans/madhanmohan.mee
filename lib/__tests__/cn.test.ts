import { cn } from '@/lib/cn';
import { describe, it, expect } from 'vitest';

describe('cn', () => {
  it('merges class names using tailwind-merge', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('resolves conflicting tailwind classes (last wins)', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('handles undefined and null values', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('');
  });
});
