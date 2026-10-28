'use client';

import { Spinner } from '@/components/motion/Spinner';
import { MdxPreview } from './MdxPreview';
import { usePreviewCompilation } from './usePreviewCompilation';

// Live rendered preview of the markdown source
export function PreviewPane({ source }: { source: string }) {
  const { compiled, error, isLoading } = usePreviewCompilation(source);

  return (
    <div className="flex flex-col min-h-[50vh]">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs text-fd-muted-foreground font-medium">
          Preview
        </span>
        {isLoading && <Spinner className="size-3" />}
      </div>
      <div className="flex-1 w-full overflow-y-auto rounded-lg border border-fd-border bg-fd-card p-4">
        {error ? (
          <div className="text-red-500 text-xs whitespace-pre-wrap font-mono">
            {error}
          </div>
        ) : compiled ? (
          <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:overflow-x-auto [&_code]:text-sm">
            <MdxPreview compiled={compiled} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-fd-muted-foreground">
            {source.trim() ? 'Compiling…' : 'Start typing to see preview'}
          </div>
        )}
      </div>
    </div>
  );
}
