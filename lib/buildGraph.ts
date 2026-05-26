import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { source } from '@/lib/source';
import type { Graph } from '../components/Graph/GraphView';
import type { Page } from 'fumadocs-core/source';

const CONTENT_DIRECTORY = path.resolve(process.cwd(), 'content/docs');

export async function buildGraph(): Promise<Graph> {
  const pages = source.getPages();
  const graph: Graph = { links: [], nodes: [] };

  function normalizeSlug(slug: string): string {
    return decodeURI(slug)
      .toLowerCase()
      .replace(/[`'"!?()[\]{},.:;@#$%^&*~<>]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '');
  }

  function buildSlugToUrlLookupMap(pages: Page[]): Map<string, string> {
    const slugToUrlLookupMap = new Map<string, string>();
    for (const page of pages) {
      slugToUrlLookupMap.set(normalizeSlug(page.url), page.url);
      const lastSlugSegment = page.slugs[page.slugs.length - 1];
      if (lastSlugSegment)
        slugToUrlLookupMap.set(normalizeSlug(lastSlugSegment), page.url);
      slugToUrlLookupMap.set(normalizeSlug(page.slugs.join('/')), page.url);
    }
    return slugToUrlLookupMap;
  }
  const slugToUrlLookupMap = buildSlugToUrlLookupMap(pages);

  function resolveWikilinkReference(rawHref: string): string | undefined {
    const cleaned = rawHref.startsWith('./') ? rawHref.slice(2) : rawHref;
    const hrefWithoutExtension = cleaned.replace(/\.mdx?$/, '');
    const normalizedTarget = normalizeSlug(hrefWithoutExtension);
    return (
      slugToUrlLookupMap.get(normalizedTarget) ??
      slugToUrlLookupMap.get(normalizeSlug(cleaned)) ??
      slugToUrlLookupMap.get(normalizeSlug(rawHref))
    );
  }

  function stripFrontmatter(markdown: string): string {
    return markdown
      .replace(/^---[\s\S]*?---\n?/, '')
      .trim()
      .slice(0, 800);
  }

  async function readHoverPreviewContent(
    filePath: string,
    page: Page,
  ): Promise<string> {
    let content = '';
    try {
      const raw = await readFile(filePath, 'utf-8');
      content = stripFrontmatter(raw);
    } catch {
      content = page.data.description ?? '';
    }
    return content;
  }

  for (const page of pages) {
    const hoverPreviewContent = await readHoverPreviewContent(
      path.resolve(CONTENT_DIRECTORY, page.path),
      page,
    );

    const pageGraphNode = {
      id: page.url,
      url: page.url,
      text: page.data.title ?? page.slugs[page.slugs.length - 1] ?? '',
      description: page.data.description,
      content: hoverPreviewContent,
    };

    graph.nodes.push(pageGraphNode);

    const { extractedReferences = [] } = page.data;

    for (const reference of extractedReferences) {
      const targetUrl = resolveWikilinkReference(reference.href);
      if (!targetUrl) continue;

      graph.links.push({
        source: page.url,
        target: targetUrl,
      });
    }
  }

  return graph;
}
