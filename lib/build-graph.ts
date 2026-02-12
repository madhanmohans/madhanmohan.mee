import { source } from '@/lib/source';
import type { Graph } from '../components/graph-view';

export function buildGraph(): Graph {
  const pages = source.getPages();
  const graph: Graph = { links: [], nodes: [] };

  // Build lookup maps for resolving references by slug or URL
  const slugToUrl = new Map<string, string>();
  for (const page of pages) {
    // Map by full URL (e.g. "/docs/hooks")
    slugToUrl.set(page.url, page.url);
    // Map by last slug segment (e.g. "hooks")
    const lastSlug = page.slugs[page.slugs.length - 1];
    if (lastSlug) slugToUrl.set(lastSlug, page.url);
    // Map by full slug path (e.g. "hooks" or "subdir/hooks")
    slugToUrl.set(page.slugs.join('/'), page.url);
  }

  function resolveRef(href: string): string | undefined {
    // Strip leading "./" if present
    const cleaned = href.startsWith('./') ? href.slice(2) : href;
    // Strip file extension if present (.md, .mdx)
    const noExt = cleaned.replace(/\.mdx?$/, '');
    return slugToUrl.get(noExt) ?? slugToUrl.get(cleaned) ?? slugToUrl.get(href);
  }

  for (const page of pages) {
    graph.nodes.push({
      id: page.url,
      url: page.url,
      text: page.data.title ?? page.slugs[page.slugs.length - 1] ?? '',
      description: page.data.description,
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
