import { isAllowedDevRequest } from '@/lib/devRequest';
import { slugify } from '@/lib/slugify';
import { NOTES_BASE_URL } from '@/app/constants';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

const CONTENT_DIRECTORY = path.resolve(process.cwd(), 'content/docs');

// Creates content/docs/<slug>.md; the title comes from the filename,
// so the body needs no frontmatter
export async function POST(request: Request) {
  if (!isAllowedDevRequest(request))
    return new Response('Not available', { status: 403 });

  const { title, content } = await request.json().catch(() => ({}));
  if (typeof title !== 'string' || typeof content !== 'string') {
    return Response.json({ error: 'Invalid note' }, { status: 400 });
  }

  const slug = slugify(title);
  if (!slug) {
    return Response.json({ error: 'Title is required' }, { status: 400 });
  }

  const filePath = path.resolve(CONTENT_DIRECTORY, `${slug}.md`);
  if (path.dirname(filePath) !== CONTENT_DIRECTORY) {
    return Response.json({ error: 'Invalid title' }, { status: 400 });
  }

  try {
    // "wx" fails instead of overwriting an existing note
    await writeFile(filePath, content, { encoding: 'utf-8', flag: 'wx' });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      return Response.json(
        { error: `A note named "${slug}" already exists` },
        { status: 409 },
      );
    }
    throw error;
  }

  return Response.json({ slug, url: `${NOTES_BASE_URL}/${slug}` }, { status: 201 });
}
