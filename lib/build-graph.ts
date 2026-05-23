import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { source } from '@/lib/source';
import type { Graph } from '../components/graph-view';
import { Page } from 'fumadocs-core/source';

const CONTENT_DIRECTORY = path.resolve(process.cwd(), 'content/docs');

export async function buildGraph(): Promise<Graph> {
  const pages = source.getPages();
  const graph: Graph = { links: [], nodes: [] };

  // Normalize a slug for consistent lookup (decode URI, lowercase, collapse hyphens)
  function normalizeSlug(s: string): string {
    return decodeURI(s)
      .toLowerCase()
      .replace(/[`'"!?()[\]{},.:;@#$%^&*~<>]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Build lookup maps for resolving references by slug or URL
  function convertSlugToURLMap(pages: Page[]): Map<string, string> {
      const convertSlugToURL = new Map<string, string>();
      for (const page of pages) {
        // Map by full URL (e.g. "/docs/hooks")
        convertSlugToURL.set(normalizeSlug(page.url), page.url);
        // Map by last slug segment (e.g. "hooks")
        const lastSlugSegment = page.slugs[page.slugs.length - 1];
        if (lastSlugSegment) convertSlugToURL.set(normalizeSlug(lastSlugSegment), page.url);
        // Map by full slug path (e.g. "hooks" or "subdir/hooks")
        convertSlugToURL.set(normalizeSlug(page.slugs.join('/')), page.url);
      }
      return convertSlugToURL;
  }
  const convertSlugToURL = convertSlugToURLMap(pages);

  function resolveRef(href: string): string | undefined {
    const cleaned = href.startsWith('./') ? href.slice(2) : href;
    const noExt = cleaned.replace(/\.mdx?$/, '');
    const key = normalizeSlug(noExt);
    return convertSlugToURL.get(key) ?? convertSlugToURL.get(normalizeSlug(cleaned)) ?? convertSlugToURL.get(normalizeSlug(href));
  }

  // Strip frontmatter (--- ... ---)
  function extractContentFromMarkdown(markdown: string): string {
    return markdown.replace(/^---[\s\S]*?---\n?/, '').trim().slice(0, 800);
  }

  // read content from file to show preview when hovered
  async function readContentFromFile(filePath: string, page: Page): Promise<string> {
    let content = '';
    try {
      const raw = await readFile(filePath, 'utf-8');
      content = extractContentFromMarkdown(raw);
    } catch {
      content = page.data.description ?? '';
    }
    return content;
  }

  // Build the graph
  for (const page of pages) {
    const previewContentOnHover = await readContentFromFile(path.resolve(CONTENT_DIRECTORY, page.path), page);

    const pageNode = {
      id: page.url,
      url: page.url,
      text: page.data.title ?? page.slugs[page.slugs.length - 1] ?? '',
      description: page.data.description,
      content: previewContentOnHover,
    };

    graph.nodes.push(pageNode);

    const { extractedReferences = [] } = page.data;

    console.log(extractedReferences, '<--- extractedReferences');

    for (const ref of extractedReferences) {
      const targetUrl = resolveRef(ref.href);
      if (!targetUrl) continue;

      graph.links.push({
        source: page.url,
        target: targetUrl,
      });
    }
  }

  return graph;
}

