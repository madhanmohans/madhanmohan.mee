import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NewNoteEditor } from '@/components/editor/NewNoteEditor';

export const metadata: Metadata = { title: 'New note' };

// Local-only: notes are written straight to content/docs
export default function NewNotePage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <DocsPage full>
      <NewNoteEditor />
    </DocsPage>
  );
}
