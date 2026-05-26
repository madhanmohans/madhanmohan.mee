import { describe, it, expect } from 'vitest';
import { getMDXComponents } from '@/MDXComponents';

describe('getMDXComponents', () => {
  it('returns an object with img override', () => {
    const components = getMDXComponents();
    expect(components).toHaveProperty('img');
  });

  it('merges custom components over defaults', () => {
    const customLink = () => null;
    const components = getMDXComponents({ a: customLink });
    expect(components.a).toBe(customLink);
  });

  it('returns spread default components', () => {
    const components = getMDXComponents();
    expect(typeof components).toBe('object');
    expect(Object.keys(components).length).toBeGreaterThan(1);
  });
});
