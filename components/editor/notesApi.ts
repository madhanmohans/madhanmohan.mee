const PAGE_READY_POLL_MS = 300;
const PAGE_READY_TIMEOUT_MS = 10_000;

function noteApiUrl(slug: string | string[]) {
  return `/api/notes/${Array.isArray(slug) ? slug.join('/') : slug}`;
}

export async function fetchNoteSource(slug: string[]): Promise<string> {
  const apiResponse = await fetch(noteApiUrl(slug));
  if (!apiResponse.ok) throw new Error('Failed to load note');
  return apiResponse.text();
}

export async function saveNoteSource(slug: string[], content: string) {
  const apiResponse = await fetch(noteApiUrl(slug), {
    method: 'PUT',
    body: content,
    headers: { 'Content-Type': 'text/plain' },
  });
  if (!apiResponse.ok) throw new Error('Failed to save');
}

export async function createNote(
  title: string,
  content: string,
): Promise<{ slug: string; url: string }> {
  const apiResponse = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  const data = await apiResponse.json();
  if (!apiResponse.ok) throw new Error(data.error ?? 'Failed to create');
  return data;
}

// The dev server picks up new files asynchronously, so wait until the
// note resolves before navigating to it
export async function waitForNote(slug: string) {
  const deadline = Date.now() + PAGE_READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const apiResponse = await fetch(noteApiUrl(slug)).catch(() => null);
    if (apiResponse?.ok) return;
    await new Promise((resolve) => setTimeout(resolve, PAGE_READY_POLL_MS));
  }
}
