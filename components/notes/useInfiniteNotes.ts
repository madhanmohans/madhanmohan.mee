'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { NoteSummary, NotesPage } from '@/lib/notesPage';

const STORAGE_KEY = 'notes-feed';

interface FeedSnapshot {
  notes: NoteSummary[];
  nextCursor: string | null;
  scrollY: number;
}

function readSnapshot(): FeedSnapshot | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FeedSnapshot) : null;
  } catch {
    return null;
  }
}

function writeSnapshot(snapshot: FeedSnapshot) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage unavailable: the feed just starts from the top next time
  }
}

export function useInfiniteNotes() {
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isFetching = useRef(false);
  const latest = useRef({ notes, nextCursor });
  latest.current = { notes, nextCursor };

  const loadMore = useCallback(async (cursor: string | null) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);
    setHasError(false);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set('cursor', cursor);
      const response = await fetch(`/api/notes?${params}`);
      if (!response.ok) throw new Error('Failed to load notes');
      const page: NotesPage = await response.json();
      setNotes((current) => {
        const seenUrls = new Set(current.map((note) => note.url));
        return [...current, ...page.notes.filter((n) => !seenUrls.has(n.url))];
      });
      setNextCursor(page.nextCursor);
    } catch {
      setHasError(true);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  }, []);

  // Coming back to the list restores the pages already loaded and the scroll
  // position; otherwise the first page is fetched
  useEffect(() => {
    const snapshot = readSnapshot();
    if (snapshot && snapshot.notes.length > 0) {
      setNotes(snapshot.notes);
      setNextCursor(snapshot.nextCursor);
      setIsReady(true);
      requestAnimationFrame(() => window.scrollTo(0, snapshot.scrollY));
    } else {
      setIsReady(true);
      void loadMore(null);
    }

    return () => {
      const { notes: loadedNotes, nextCursor: cursor } = latest.current;
      if (loadedNotes.length > 0) {
        writeSnapshot({
          notes: loadedNotes,
          nextCursor: cursor,
          scrollY: window.scrollY,
        });
      }
    };
  }, [loadMore]);

  const hasMore = nextCursor !== null;
  const loadNext = useCallback(
    () => hasMore && void loadMore(nextCursor),
    [hasMore, nextCursor, loadMore],
  );

  return { notes, isLoading, hasError, hasMore, isReady, loadNext };
}
