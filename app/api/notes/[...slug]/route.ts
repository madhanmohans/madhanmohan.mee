import { source } from '@/lib/source';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/docs');

function resolveFilePath(pagePath: string): string {
  const resolved = path.resolve(CONTENT_DIR, pagePath);
  if (!resolved.startsWith(CONTENT_DIR)) {
    throw new Error('Invalid path');
  }
  return resolved;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    return new Response('Not found', { status: 404 });
  }

  const filePath = resolveFilePath(page.path);
  const content = await readFile(filePath, 'utf-8');

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    return new Response('Not found', { status: 404 });
  }

  const body = await req.text();
  const filePath = resolveFilePath(page.path);

  await writeFile(filePath, body, 'utf-8');
  revalidatePath(page.url);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
