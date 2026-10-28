import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { source } from '@/lib/source';
import { slugify } from '@/lib/slugify';
import type { Graph } from '@/components/graph/types';
import type { Page } from 'fumadocs-core/source';

const CONTENT_DIRECTORY = path.resolve(process.cwd(), 'content/docs');
const HOVER_PREVIEW_LENGTH = 800;

function normalizeSlug(slug: string): string {
  return slugify(decodeURI(slug));
}

function buildSlugToUrlLookupMap(pages: Page[]): Map<string, string> {
  const slugToUrlLookupMap = new Map<string, string>();
  for (const page of pages) {
    slugToUrlLookupMap.set(normalizeSlug(page.url), page.url);
    const lastSlugSegment = page.slugs.at(-1);
    if (lastSlugSegment)
      slugToUrlLookupMap.set(normalizeSlug(lastSlugSegment), page.url);
    slugToUrlLookupMap.set(normalizeSlug(page.slugs.join('/')), page.url);
  }
  return slugToUrlLookupMap;
}

function resolveWikilinkReference(
  rawHref: string,
  slugToUrlLookupMap: Map<string, string>,
): string | undefined {
  const cleaned = rawHref.startsWith('./') ? rawHref.slice(2) : rawHref;
  const hrefWithoutExtension = cleaned.replace(/\.mdx?$/, '');
  return (
    slugToUrlLookupMap.get(normalizeSlug(hrefWithoutExtension)) ??
    slugToUrlLookupMap.get(normalizeSlug(cleaned)) ??
    slugToUrlLookupMap.get(normalizeSlug(rawHref))
  );
}

function stripFrontmatter(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\n?/, '')
    .trim()
    .slice(0, HOVER_PREVIEW_LENGTH);
}

async function readHoverPreviewContent(page: Page): Promise<string> {
  try {
    const raw = await readFile(
      path.resolve(CONTENT_DIRECTORY, page.path),
      'utf-8',
    );
    return stripFrontmatter(raw);
  } catch {
    return page.data.description ?? '';
  }
}

export async function buildGraph(): Promise<Graph> {
  const pages = source.getPages();
  const slugToUrlLookupMap = buildSlugToUrlLookupMap(pages);
  const graph: Graph = { links: [], nodes: [] };

  for (const page of pages) {
    graph.nodes.push({
      id: page.url,
      url: page.url,
      text: page.data.title ?? page.slugs.at(-1) ?? '',
      description: page.data.description,
      content: await readHoverPreviewContent(page),
    });

    const { extractedReferences = [] } = page.data;
    for (const reference of extractedReferences) {
      const targetUrl = resolveWikilinkReference(
        reference.href,
        slugToUrlLookupMap,
      );
      if (targetUrl) graph.links.push({ source: page.url, target: targetUrl });
    }
  }

  return graph;
}
