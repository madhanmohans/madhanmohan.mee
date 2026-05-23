import { source } from '@/lib/source';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const CONTENT_DIRECTORY = path.resolve(process.cwd(), 'content/docs');

function assertValidFilePath(pagePath: string): string {
  const resolvedPath = path.resolve(CONTENT_DIRECTORY, pagePath);
  if (!resolvedPath.startsWith(CONTENT_DIRECTORY)) {
    throw new Error('Invalid path');
  }
  return resolvedPath;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  if (!IS_DEVELOPMENT) return new Response('Not available', { status: 403 });
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    return new Response('Not found', { status: 404 });
  }

  const filePath = assertValidFilePath(page.path);
  const content = await readFile(filePath, 'utf-8');

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  if (!IS_DEVELOPMENT) return new Response('Not available', { status: 403 });
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    return new Response('Not found', { status: 404 });
  }

  const body = await request.text();
  const filePath = assertValidFilePath(page.path);

  await writeFile(filePath, body, 'utf-8');
  revalidatePath(page.url);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
