'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { normalizeTag } from '@/lib/tags';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { SuggestedTags } from './SuggestedTags';
import { TagChip } from './TagChip';
import { fetchTagSuggestions, saveNoteTags } from './tagsApi';

export function NoteTags({
  slug,
  tags,
  editable,
}: {
  slug: string[];
  tags: string[];
  editable: boolean;
}) {
  const router = useRouter();
  const [appliedTags, setAppliedTags] = useState(tags);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [newTagDraft, setNewTagDraft] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Server props win once the refreshed page arrives
  useEffect(() => setAppliedTags(tags), [tags]);

  if (!editable && tags.length === 0) return null;

  async function saveTags(nextTags: string[]) {
    const previousTags = appliedTags;
    setAppliedTags(nextTags);
    setErrorMessage('');
    try {
      await saveNoteTags(slug, nextTags);
      router.refresh();
    } catch (error) {
      console.error(error);
      setAppliedTags(previousTags);
      setErrorMessage('Could not save tags');
    }
  }

  function addTags(newTags: string[]) {
    const tagsToAdd = newTags
      .map(normalizeTag)
      .filter((tag) => tag && !appliedTags.includes(tag));
    setSuggestedTags((current) =>
      current.filter((tag) => !newTags.includes(tag)),
    );
    if (tagsToAdd.length > 0) saveTags([...appliedTags, ...tagsToAdd]);
  }

  async function requestSuggestions() {
    setIsSuggesting(true);
    setErrorMessage('');
    try {
      const suggestions = await fetchTagSuggestions(slug);
      setSuggestedTags(suggestions);
      if (suggestions.length === 0) setErrorMessage('No new tags to suggest');
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'Could not get suggestions',
      );
    } finally {
      setIsSuggesting(false);
    }
  }

  return (
    <div data-tour="note-tags" className="flex flex-col gap-2 mt-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <AnimatePresence initial={false}>
          {appliedTags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              action={
                editable && (
                  <button
                    type="button"
                    onClick={() =>
                      saveTags(appliedTags.filter((t) => t !== tag))
                    }
                    className="note-tag-remove"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="size-3" />
                  </button>
                )
              }
            />
          ))}
        </AnimatePresence>

        {editable && (
          <>
            <input
              value={newTagDraft}
              onChange={(event) => setNewTagDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  addTags([newTagDraft]);
                  setNewTagDraft('');
                }
              }}
              placeholder="+ tag"
              aria-label="Add tag"
              className="note-tag-input"
            />
            <button
              type="button"
              onClick={requestSuggestions}
              disabled={isSuggesting}
              className={cn(
                buttonVariants({
                  color: 'ghost',
                  size: 'sm',
                  className:
                    'gap-1.5 [&_svg]:size-3.5 text-xs text-fd-muted-foreground',
                }),
              )}
            >
              <Sparkles className={cn(isSuggesting && 'animate-pulse')} />
              {isSuggesting ? 'Thinking…' : 'Suggest'}
            </button>
          </>
        )}
      </div>

      <SuggestedTags
        tags={suggestedTags}
        onAdd={addTags}
        onDismiss={() => setSuggestedTags([])}
      />

      {errorMessage && (
        <span className="text-xs text-fd-muted-foreground">{errorMessage}</span>
      )}
    </div>
  );
}
