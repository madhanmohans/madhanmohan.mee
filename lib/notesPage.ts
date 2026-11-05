// Keyset pagination for the notes feed. The cursor is the url of the last
// note already sent, so notes added or removed between requests can never
// make a page repeat or skip a note (an offset would).

export interface NoteSummary {
  url: string;
  title: string;
  description?: string;
}

export interface NotesPage {
  notes: NoteSummary[];
  nextCursor: string | null;
}

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

export function parsePageSize(raw: string | null): number {
  const size = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(size) || size < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(size, MAX_PAGE_SIZE);
}

export function paginateNotes(
  allNotes: NoteSummary[],
  cursor: string | null,
  limit: number,
): NotesPage {
  const sortedNotes = [...allNotes].sort((a, b) =>
    a.url < b.url ? -1 : a.url > b.url ? 1 : 0,
  );
  const remainingNotes = cursor
    ? sortedNotes.filter((note) => note.url > cursor)
    : sortedNotes;
  const notes = remainingNotes.slice(0, limit);
  const hasMore = remainingNotes.length > limit;

  return { notes, nextCursor: hasMore ? notes[notes.length - 1].url : null };
}
