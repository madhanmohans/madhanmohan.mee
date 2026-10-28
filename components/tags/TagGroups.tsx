'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Hash } from 'lucide-react';
import { AnimatePresence, m } from 'framer-motion';
import type { TagGroup } from '@/lib/tags';

export function TagGroups({
  groups,
  currentTags,
  currentUrl,
}: {
  groups: TagGroup[];
  currentTags: string[];
  currentUrl: string;
}) {
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  // The open note's tags float to the top; the rest keep size order
  const orderedGroups = useMemo(() => {
    const isCurrent = (group: TagGroup) => currentTags.includes(group.tag);
    return [
      ...groups.filter(isCurrent),
      ...groups.filter((g) => !isCurrent(g)),
    ];
  }, [groups, currentTags]);

  if (groups.length === 0) return null;

  return (
    <nav className="tag-groups" aria-label="Tags" data-tour="tag-groups">
      <p className="tag-groups-heading">Tags</p>
      <ul className="tag-groups-list">
        {orderedGroups.map(({ tag, notes }) => {
          const isExpanded = expandedTag === tag;
          return (
            <li key={tag}>
              <button
                type="button"
                className="tag-group-row"
                data-active={currentTags.includes(tag)}
                aria-expanded={isExpanded}
                onClick={() => setExpandedTag(isExpanded ? null : tag)}
              >
                <Hash className="size-3.5 shrink-0" />
                <span className="truncate">{tag}</span>
                <span className="tag-group-count">{notes.length}</span>
                <ChevronRight
                  className="tag-group-chevron size-3 shrink-0"
                  data-expanded={isExpanded}
                />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <m.ul
                    className="tag-group-notes"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {notes.map((note) => (
                      <li key={note.url}>
                        <Link
                          href={note.url}
                          className="tag-group-note"
                          data-current={note.url === currentUrl}
                        >
                          {note.title}
                        </Link>
                      </li>
                    ))}
                  </m.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
