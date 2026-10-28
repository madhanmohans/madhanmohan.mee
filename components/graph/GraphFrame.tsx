import { cn } from '@/lib/cn';

// Interactive graph canvases default to the window size, so the frame is
// fixed at viewport height; the loading placeholder uses the same frame so
// nothing shifts or flashes when the graph mounts
export const graphFrameClassName =
  'relative h-dvh rounded-xl overflow-hidden bg-fd-background';

export const graphFrameShadow =
  '0 1px 2px rgba(17,24,39,0.04), 0 4px 8px rgba(17,24,39,0.02), 0 12px 24px rgba(17,24,39,0.015)';

export function GraphFramePlaceholder({
  className,
  withShadow = true,
}: {
  className?: string;
  withShadow?: boolean;
}) {
  return (
    <div
      className={cn(graphFrameClassName, className)}
      style={withShadow ? { boxShadow: graphFrameShadow } : undefined}
      role="status"
    >
      <span className="sr-only">loading...</span>
    </div>
  );
}
