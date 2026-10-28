'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hash, Plus, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { normalizeTag } from '@/lib/tags';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

const chipTransition = { duration: 0.15, ease: 'easeOut' as const };

function TagChip({
  tag,
  variant = 'applied',
  onClick,
  action,
}: {
  tag: string;
  variant?: 'applied' | 'suggested';
  onClick?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={chipTransition}
      className="note-tag"
      data-variant={variant}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className="inline-flex items-center gap-1"
        aria-label={variant === 'suggested' ? `Add tag ${tag}` : undefined}
      >
        {variant === 'suggested' ? (
          <Plus className="size-3" />
        ) : (
          <Hash className="size-3 opacity-50" />
        )}
        {tag}
      </button>
      {action}
    </motion.span>
  );
}

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
      const apiResponse = await fetch('/api/tags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, tags: nextTags }),
      });
      if (!apiResponse.ok) throw new Error('Failed to save tags');
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
      const apiResponse = await fetch('/api/tags/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const result = await apiResponse.json();
      if (!apiResponse.ok) throw new Error(result.error);
      setSuggestedTags(result.tags);
      if (result.tags.length === 0) setErrorMessage('No new tags to suggest');
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

      <AnimatePresence initial={false}>
        {suggestedTags.length > 0 && (
          <motion.div
            key="suggestions"
            className="flex flex-wrap items-center gap-1.5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={chipTransition}
          >
            <span className="text-xs text-fd-muted-foreground">Suggested</span>
            <AnimatePresence initial={false}>
              {suggestedTags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  variant="suggested"
                  onClick={() => addTags([tag])}
                />
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => addTags(suggestedTags)}
              className="text-xs text-fd-muted-foreground hover:text-fd-foreground"
            >
              Add all
            </button>
            <button
              type="button"
              onClick={() => setSuggestedTags([])}
              className="text-xs text-fd-muted-foreground hover:text-fd-foreground"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMessage && (
        <span className="text-xs text-fd-muted-foreground">{errorMessage}</span>
      )}
    </div>
  );
}
