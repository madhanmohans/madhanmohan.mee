'use client';

import { PreviewPane } from './PreviewPane';
import { SourcePane } from './SourcePane';

// Side-by-side markdown textarea and live MDX preview, shared by the
// note editor and the new-note page
export function MarkdownEditor({
  value,
  onChange,
  autoFocus = true,
}: {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[70vh]">
      <SourcePane value={value} onChange={onChange} autoFocus={autoFocus} />
      <PreviewPane source={value} />
    </div>
  );
}
