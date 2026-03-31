import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { source } from '@/lib/source';
import type { Graph } from '../components/graph-view';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/docs');

export async function buildGraph(): Promise<Graph> {
  const pages = source.getPages();
  const graph: Graph = { links: [], nodes: [] };

  // Normalize a slug for consistent lookup (decode URI, lowercase, collapse hyphens)
  function normalize(s: string): string {
    return decodeURI(s)
      .toLowerCase()
      .replace(/[`'"!?()[\]{},.:;@#$%^&*~<>]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Build lookup maps for resolving references by slug or URL
  const slugToUrl = new Map<string, string>();
  for (const page of pages) {
    // Map by full URL (e.g. "/docs/hooks")
    slugToUrl.set(normalize(page.url), page.url);
    // Map by last slug segment (e.g. "hooks")
    const lastSlug = page.slugs[page.slugs.length - 1];
    if (lastSlug) slugToUrl.set(normalize(lastSlug), page.url);
    // Map by full slug path (e.g. "hooks" or "subdir/hooks")
    slugToUrl.set(normalize(page.slugs.join('/')), page.url);
  }

  function resolveRef(href: string): string | undefined {
    const cleaned = href.startsWith('./') ? href.slice(2) : href;
    const noExt = cleaned.replace(/\.mdx?$/, '');
    const key = normalize(noExt);
    return slugToUrl.get(key) ?? slugToUrl.get(normalize(cleaned)) ?? slugToUrl.get(normalize(href));
  }

  for (const page of pages) {
    let content = '';
    try {
      const filePath = path.resolve(CONTENT_DIR, page.path);
      const raw = await readFile(filePath, 'utf-8');
      // Strip frontmatter (--- ... ---)
      content = raw.replace(/^---[\s\S]*?---\n?/, '').trim().slice(0, 800);
    } catch {
      content = page.data.description ?? '';
    }

    graph.nodes.push({
      id: page.url,
      url: page.url,
      text: page.data.title ?? page.slugs[page.slugs.length - 1] ?? '',
      description: page.data.description,
      content,
    });

    const { extractedReferences = [] } = page.data;
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
