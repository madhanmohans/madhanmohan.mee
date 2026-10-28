import { NOTES_BASE_URL } from '@/app/constants';
import { isAllowedDevRequest, resolveInside } from '@/lib/devRequest';
import { source } from '@/lib/source';
import {
  extractInlineTags,
  normalizeTags,
  removeInlineTags,
  setFrontmatterTags,
} from '@/lib/tags';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const CONTENT_DIRECTORY = path.resolve(process.cwd(), 'content/docs');

// Replaces a note's frontmatter tags: { slug: string[], tags: string[] }
export async function PUT(request: Request) {
  if (!isAllowedDevRequest(request))
    return new Response('Not available', { status: 403 });

  const { slug, tags } = await request.json().catch(() => ({}));
  if (!Array.isArray(slug) || !Array.isArray(tags)) {
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

  const normalizedTags = normalizeTags(tags);
  const removedTags = page.data.tags.filter(
    (tag: string) => !normalizedTags.includes(tag),
  );

  // Removed tags must go from the body too, or they'd come back as inline
  // tags; tags still written inline stay out of the frontmatter
  const content = removeInlineTags(
    await readFile(filePath, 'utf-8'),
    removedTags,
  );
  const remainingInlineTags = extractInlineTags(content);
  const frontmatterTags = normalizedTags.filter(
    (tag) => !remainingInlineTags.includes(tag),
  );
  await writeFile(
    filePath,
    setFrontmatterTags(content, frontmatterTags),
    'utf-8',
  );
  revalidatePath(NOTES_BASE_URL, 'layout');

  return Response.json({ tags: normalizedTags });
}
