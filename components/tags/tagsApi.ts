export async function saveNoteTags(slug: string[], tags: string[]) {
  const apiResponse = await fetch('/api/tags', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, tags }),
  });
  if (!apiResponse.ok) throw new Error('Failed to save tags');
}

export async function fetchTagSuggestions(slug: string[]): Promise<string[]> {
  const apiResponse = await fetch('/api/tags/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  });
  const result = await apiResponse.json();
  if (!apiResponse.ok) throw new Error(result.error);
  return result.tags;
}
