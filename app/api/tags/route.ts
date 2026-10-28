import { source } from '@/lib/source';
import { normalizeTags, setFrontmatterTags } from '@/lib/tags';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const CONTENT_DIRECTORY = path.resolve(process.cwd(), 'content/docs');

// Replaces a note's frontmatter tags: { slug: string[], tags: string[] }
export async function PUT(request: Request) {
  if (!IS_DEVELOPMENT) return new Response('Not available', { status: 403 });

  const { slug, tags } = await request.json().catch(() => ({}));
  if (!Array.isArray(slug) || !Array.isArray(tags)) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const page = source.getPage(slug);
  if (!page) return Response.json({ error: 'Not found' }, { status: 404 });

  const filePath = path.resolve(CONTENT_DIRECTORY, page.path);
  if (!filePath.startsWith(CONTENT_DIRECTORY)) {
    return Response.json({ error: 'Invalid path' }, { status: 400 });
  }

  const normalizedTags = normalizeTags(tags);
  const content = await readFile(filePath, 'utf-8');
  await writeFile(
    filePath,
    setFrontmatterTags(content, normalizedTags),
    'utf-8',
  );
  revalidatePath('/column', 'layout');

  return Response.json({ tags: normalizedTags });
}
