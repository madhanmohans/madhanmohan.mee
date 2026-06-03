import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetPages = vi.fn();
const mockReadFile = vi.fn();

vi.mock('@/lib/source', () => ({
  source: {
    getPages: mockGetPages,
  },
}));

vi.mock('node:fs/promises', () => ({
  readFile: mockReadFile,
  default: {
    readFile: mockReadFile,
  },
}));

describe('buildGraph', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('process', {
      ...process,
      cwd: () => '/root',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds a graph from pages with wikilinks', async () => {
    mockGetPages.mockReturnValue([
      {
        url: '/column/page-a',
        slugs: ['page-a'],
        path: 'page-a.md',
        data: {
          title: 'Page A',
          description: 'Desc A',
          extractedReferences: [{ href: 'page-b' }],
        },
      },
      {
        url: '/column/page-b',
        slugs: ['page-b'],
        path: 'page-b.md',
        data: {
          title: 'Page B',
          description: 'Desc B',
          extractedReferences: [],
        },
      },
    ]);

    mockReadFile.mockResolvedValue('---\ntitle: Page A\n---\n\nContent.');

    const { buildGraph } = await import('@/lib/buildGraph');
    const graph = await buildGraph();

    expect(graph.nodes).toHaveLength(2);
    expect(graph.links).toHaveLength(1);
    expect(graph.links[0].source).toBe('/column/page-a');
    expect(graph.links[0].target).toBe('/column/page-b');
  });

  it('handles pages without wikilinks', async () => {
    mockGetPages.mockReturnValue([
      {
        url: '/column/solo',
        slugs: ['solo'],
        path: 'solo.md',
        data: { title: 'Solo', description: 'Just one' },
      },
    ]);

    mockReadFile.mockResolvedValue('Just some content');

    const { buildGraph } = await import('@/lib/buildGraph');
    const graph = await buildGraph();

    expect(graph.nodes).toHaveLength(1);
    expect(graph.links).toHaveLength(0);
  });

  it('handles unresolvable wikilinks gracefully', async () => {
    mockGetPages.mockReturnValue([
      {
        url: '/column/source',
        slugs: ['source'],
        path: 'source.md',
        data: {
          title: 'Source',
          extractedReferences: [{ href: 'nonexistent' }],
          description: 'Fallback',
        },
      },
    ]);

    mockReadFile.mockResolvedValue('Content');

    const { buildGraph } = await import('@/lib/buildGraph');
    const graph = await buildGraph();

    expect(graph.nodes).toHaveLength(1);
    expect(graph.links).toHaveLength(0);
  });

  it('uses description as fallback when file read fails', async () => {
    mockGetPages.mockReturnValue([
      {
        url: '/column/error',
        slugs: ['error'],
        path: 'nonexistent.md',
        data: {
          title: 'Error Page',
          description: 'Fallback desc',
        },
      },
    ]);

    mockReadFile.mockRejectedValue(new Error('Not found'));

    const { buildGraph } = await import('@/lib/buildGraph');
    const graph = await buildGraph();

    expect(graph.nodes).toHaveLength(1);
    expect(graph.nodes[0].content).toBe('Fallback desc');
  });

  it('normalizes slugs correctly', () => {
    const normalizeSlug = (slug: string) =>
      decodeURI(slug)
        .toLowerCase()
        .replace(/[`'"!?()[\]{},.:;@#$%^&*~<>]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '');

    expect(normalizeSlug('Hello World')).toBe('hello-world');
    expect(normalizeSlug("What's New!")).toBe('whats-new');
    expect(normalizeSlug('Multiple   Spaces')).toBe('multiple-spaces');
    expect(normalizeSlug('Leading---Trailing---')).toBe('leading-trailing');
  });
});
