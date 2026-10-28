import { useEffect, useState } from 'react';

const PREVIEW_DEBOUNCE_MS = 500;

// Compiles markdown into MDX on the server, debounced while the user types
export function usePreviewCompilation(source: string) {
  const [compiled, setCompiled] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!source.trim()) {
      setCompiled('');
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: source }),
        });
        const data = await res.json();
        if (res.ok) {
          setCompiled(data.compiled);
        } else {
          setError(data.error ?? 'Preview failed');
        }
      } catch {
        setError('Preview request failed');
      } finally {
        setIsLoading(false);
      }
    }, PREVIEW_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [source]);

  return { compiled, error, isLoading };
}
