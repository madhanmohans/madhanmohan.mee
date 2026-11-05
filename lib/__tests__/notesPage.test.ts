import { describe, it, expect } from 'vitest';
import {
  paginateNotes,
  parsePageSize,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '@/lib/notesPage';

const notes = ['c', 'a', 'e', 'b', 'd'].map((id) => ({
  url: `/note/${id}`,
  title: id,
}));

describe('paginateNotes', () => {
  it('returns sorted first page with a cursor', () => {
    const page = paginateNotes(notes, null, 2);
    expect(page.notes.map((n) => n.title)).toEqual(['a', 'b']);
    expect(page.nextCursor).toBe('/note/b');
  });

  it('walks every note exactly once and ends with a null cursor', () => {
    const seen: string[] = [];
    let cursor: string | null = null;
    do {
      const page = paginateNotes(notes, cursor, 2);
      seen.push(...page.notes.map((n) => n.title));
      cursor = page.nextCursor;
    } while (cursor);
    expect(seen).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('has no next cursor when the last page is exactly full', () => {
    expect(paginateNotes(notes, '/note/c', 2).nextCursor).toBeNull();
  });

  it('does not skip or repeat notes when one is added between pages', () => {
    const first = paginateNotes(notes, null, 2);
    const withNew = [...notes, { url: '/note/aa', title: 'aa' }];
    const second = paginateNotes(withNew, first.nextCursor, 2);
    expect(second.notes.map((n) => n.title)).toEqual(['c', 'd']);
  });
});

describe('parsePageSize', () => {
  it('defaults and clamps', () => {
    expect(parsePageSize(null)).toBe(DEFAULT_PAGE_SIZE);
    expect(parsePageSize('abc')).toBe(DEFAULT_PAGE_SIZE);
    expect(parsePageSize('0')).toBe(DEFAULT_PAGE_SIZE);
    expect(parsePageSize('5')).toBe(5);
    expect(parsePageSize('9999')).toBe(MAX_PAGE_SIZE);
  });
});
