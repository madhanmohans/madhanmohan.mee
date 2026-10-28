'use client';

import { useEffect, useState, type FC } from 'react';
import { executeMdx } from '@fumadocs/mdx-remote/client';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export function MdxPreview({ compiled }: { compiled: string }) {
  const [Component, setComponent] = useState<FC<{
    components?: MDXComponents;
  }> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!compiled) return;

    let cancelled = false;

    (async () => {
      try {
        const { default: MdxComponent } = await executeMdx(compiled, {});
        if (!cancelled) {
          setComponent(() => MdxComponent);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Render failed');
          setComponent(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [compiled]);

  if (error) {
    return (
      <div className="text-red-500 text-xs whitespace-pre-wrap font-mono">
        {error}
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-fd-muted-foreground">
        Rendering…
      </div>
    );
  }

  return <Component components={defaultMdxComponents} />;
}
