import { isAllowedDevRequest, resolveInside } from '@/lib/devRequest';
import { getTagGroups, source } from '@/lib/source';
import { LocalLLMError, suggestTags } from '@/lib/suggestTags';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

const CONTENT_DIRECTORY = path.resolve(process.cwd(), 'content/docs');

// Asks the local LLM for tags the note doesn't have yet: { slug: string[] }
export async function POST(request: Request) {
  if (!isAllowedDevRequest(request))
    return new Response('Not available', { status: 403 });

  const { slug } = await request.json().catch(() => ({}));
  if (!Array.isArray(slug)) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const page = source.getPage(slug);
  if (!page) return Response.json({ error: 'Not found' }, { status: 404 });

  let filePath: string;
  try {
    filePath = resolveInside(CONTENT_DIRECTORY, page.path);
  } catch {
    return Response.json({ error: 'Invalid path' }, { status: 400 });
  }

  const content = (await readFile(filePath, 'utf-8')).replace(
    /^---[\s\S]*?---\n?/,
    '',
  );

  try {
    const suggestedTags = await suggestTags({
      title: page.data.title,
      content,
      // Most-used first, so the model leans toward established groups
      existingTags: getTagGroups().map((group) => group.tag),
    });
    const currentTags = new Set(page.data.tags);
    return Response.json({
      tags: suggestedTags.filter((tag) => !currentTags.has(tag)),
    });
  } catch (error) {
    if (error instanceof LocalLLMError) {
      return Response.json({ error: error.message }, { status: 502 });
    }
    throw error;
  }
}
