import {
  groupNotesByTag,
  normalizeTag,
  normalizeTags,
  setFrontmatterTags,
} from '@/lib/tags';
import { describe, it, expect } from 'vitest';

describe('normalizeTag', () => {
  it('strips leading hashes and kebab-cases', () => {
    expect(normalizeTag('#Machine Learning')).toBe('machine-learning');
  });

  it('keeps nested tag slashes', () => {
    expect(normalizeTag('ml/optimizers')).toBe('ml/optimizers');
  });

  it('trims stray separators', () => {
    expect(normalizeTag('  --react!! ')).toBe('react');
  });
});

describe('normalizeTags', () => {
  it('dedupes after normalizing', () => {
    expect(normalizeTags(['#work', 'work', 'Work'])).toEqual(['work']);
  });

  it('splits a bare string value', () => {
    expect(normalizeTags('react, frontend')).toEqual(['react', 'frontend']);
  });

  it('returns [] for empty or missing values', () => {
    expect(normalizeTags(null)).toEqual([]);
    expect(normalizeTags(undefined)).toEqual([]);
    expect(normalizeTags([null, ''])).toEqual([]);
  });
});

describe('setFrontmatterTags', () => {
  it('adds frontmatter to a note without any', () => {
    expect(setFrontmatterTags('# relu\n', ['ml'])).toBe(
      '---\ntags:\n  - ml\n---\n\n# relu\n',
    );
  });

  it('leaves a note without frontmatter alone when there are no tags', () => {
    expect(setFrontmatterTags('# relu\n', [])).toBe('# relu\n');
  });

  it('replaces an existing tag list and keeps other keys', () => {
    const note = [
      '---',
      "Created Time: ''",
      'tags:',
      '  - react',
      "  - '#work'",
      'Parent:',
      '---',
      '',
      'body',
    ].join('\n');

    expect(setFrontmatterTags(note, ['react', 'interview'])).toBe(
      [
        '---',
        "Created Time: ''",
        'tags:',
        '  - react',
        '  - interview',
        'Parent:',
        '---',
        '',
        'body',
      ].join('\n'),
    );
  });

  it('replaces an inline tags value', () => {
    expect(setFrontmatterTags('---\ntags: [a]\n---\nbody', ['b'])).toBe(
      '---\ntags:\n  - b\n---\nbody',
    );
  });

  it('appends tags to frontmatter that has none', () => {
    expect(setFrontmatterTags('---\ntitle: X\n---\nbody', ['b'])).toBe(
      '---\ntitle: X\ntags:\n  - b\n---\nbody',
    );
  });

  it('writes an empty list when all tags are removed', () => {
    expect(setFrontmatterTags('---\ntags:\n  - a\n---\nbody', [])).toBe(
      '---\ntags: []\n---\nbody',
    );
  });
});

describe('groupNotesByTag', () => {
  it('groups notes and sorts by group size, then name', () => {
    const groups = groupNotesByTag([
      { url: '/a', title: 'B note', tags: ['ml', 'react'] },
      { url: '/b', title: 'A note', tags: ['ml'] },
      { url: '/c', title: 'C note', tags: ['android'] },
    ]);

    expect(groups.map((g) => g.tag)).toEqual(['ml', 'android', 'react']);
    expect(groups[0].notes.map((n) => n.title)).toEqual(['A note', 'B note']);
  });
});
