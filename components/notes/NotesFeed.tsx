'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Spinner } from '@/components/motion/Spinner';
import { useInfiniteNotes } from './useInfiniteNotes';

// Start fetching well before the sentinel reaches the viewport so the
// next page is usually in by the time the user gets there
const PREFETCH_MARGIN = '600px';

export function NotesFeed() {
  const { notes, isLoading, hasError, hasMore, isReady, loadNext } =
    useInfiniteNotes();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !isReady || !hasMore || hasError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadNext();
      },
      { rootMargin: `0px 0px ${PREFETCH_MARGIN} 0px` },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // notes.length: re-observe after each page so a still-visible sentinel
    // triggers the next load
  }, [isReady, hasMore, hasError, loadNext, notes.length]);

  return (
    <section aria-label="All notes" className="mt-6">
      <ul className="flex flex-col gap-3">
        {notes.map((note) => (
          <li key={note.url}>
            <Link
              href={note.url}
              className="font-medium text-fd-foreground hover:underline"
            >
              {note.title}
            </Link>
            {note.description && (
              <p className="text-sm text-fd-muted-foreground">
                {note.description}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} aria-hidden className="h-px" />

      {isLoading && (
        <div
          role="status"
          aria-label="Loading notes"
          className="flex justify-center py-4"
        >
          <Spinner className="size-5" />
        </div>
      )}
      {hasError && (
        <button
          type="button"
          className="text-sm text-fd-muted-foreground underline"
          onClick={loadNext}
        >
          Could not load notes. Retry
        </button>
      )}
    </section>
  );
}
