import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetPages = vi.fn();

vi.mock('@/lib/source', () => ({
  source: {
    getPages: mockGetPages,
  },
}));

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('returns empty results when search returns no hits', async () => {
    const mockDb = { id: 'test-db' };

    vi.doMock('@orama/orama', () => ({
      create: vi.fn().mockResolvedValue(mockDb),
      insert: vi.fn().mockResolvedValue(undefined),
      search: vi.fn().mockResolvedValue({ hits: [] }),
    }));

    mockGetPages.mockReturnValue([]);

    const { GET } = await import('@/app/api/search/route');
    const request = new Request('http://localhost/api/search?query=');
    const response = await GET(request);
    const body = await response.json();

    expect(body).toEqual([]);
  });

  it('indexes pages and returns search results', async () => {
    const mockDb = { id: 'test-db' };

    vi.doMock('@orama/orama', () => ({
      create: vi.fn().mockResolvedValue(mockDb),
      insert: vi.fn().mockResolvedValue(undefined),
      search: vi.fn().mockResolvedValue({
        hits: [
          {
            id: 'hit1',
            document: { url: '/column/test', title: 'Test' },
          },
        ],
      }),
    }));

    mockGetPages.mockReturnValue([
      {
        url: '/column/test',
        data: { title: 'Test', description: 'A test', toc: [] },
      },
    ]);

    const { GET } = await import('@/app/api/search/route');
    const request = new Request('http://localhost/api/search?query=test');
    const response = await GET(request);
    const body = await response.json();

    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({
      url: '/column/test',
      type: 'page',
    });
  });

  it('indexes headings from table of contents', async () => {
    const mockDb = { id: 'test-db' };
    const mockInsert = vi.fn().mockResolvedValue(undefined);

    vi.doMock('@orama/orama', () => ({
      create: vi.fn().mockResolvedValue(mockDb),
      insert: mockInsert,
      search: vi.fn().mockResolvedValue({ hits: [] }),
    }));

    const tocItem = {
      url: '#section-1',
      title: {
        props: { children: 'Section 1' },
      },
    };

    mockGetPages.mockReturnValue([
      {
        url: '/column/test',
        data: {
          title: 'Test',
          description: 'Desc',
          toc: [tocItem],
        },
      },
    ]);

    const { GET } = await import('@/app/api/search/route');
    const request = new Request('http://localhost/api/search?query=test');
    await GET(request);

    expect(mockInsert).toHaveBeenCalledTimes(2);
  });

  it('returns 500 on error', async () => {
    vi.doMock('@orama/orama', () => ({
      create: vi.fn().mockRejectedValue(new Error('DB error')),
      insert: vi.fn(),
      search: vi.fn(),
    }));

    mockGetPages.mockReturnValue([]);

    const { GET } = await import('@/app/api/search/route');
    const request = new Request('http://localhost/api/search?query=test');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'DB error' });
  });

  it('falls back to default titles and extracts nested heading text', async () => {
    const mockInsert = vi.fn().mockResolvedValue(undefined);
    vi.doMock('@orama/orama', () => ({
      create: vi.fn().mockResolvedValue({}),
      insert: mockInsert,
      search: vi.fn().mockResolvedValue({ hits: [] }),
    }));

    mockGetPages.mockReturnValue([
      {
        url: '/column/a',
        data: {
          toc: [
            {
              url: '#nested',
              title: [
                'Intro ',
                { props: { children: ['to ', { props: { children: 'X' } }] } },
              ],
            },
            { url: '#empty', title: { props: {} } },
            { url: '#number', title: 42 },
            { title: 'No anchor' },
          ],
        },
      },
      {
        url: '/column/a',
        data: { title: 'Duplicate', toc: [{ url: '#nested', title: 'dup' }] },
      },
      { url: '/column/b', data: { title: 'B' } },
    ]);

    const { GET } = await import('@/app/api/search/route');
    await GET(new Request('http://localhost/api/search?query=x'));

    // the anchor-less heading resolves to the page url and the repeated page is skipped
    const inserted = mockInsert.mock.calls.map((call) => call[1]);
    expect(inserted).toEqual([
      { id: '/column/a', title: 'Untitled', content: '', url: '/column/a' },
      {
        id: '/column/a#nested',
        title: 'Intro to X',
        content: '',
        url: '/column/a#nested',
      },
      {
        id: '/column/a#empty',
        title: 'Heading',
        content: '',
        url: '/column/a#empty',
      },
      {
        id: '/column/a#number',
        title: 'Heading',
        content: '',
        url: '/column/a#number',
      },
      { id: '/column/b', title: 'B', content: '', url: '/column/b' },
    ]);
  });

  it('labels heading hits and defaults to an empty query', async () => {
    const mockSearch = vi.fn().mockResolvedValue({
      hits: [
        { id: '/column/a#h', document: { url: '/column/a#h', title: 'H' } },
      ],
    });
    vi.doMock('@orama/orama', () => ({
      create: vi.fn().mockResolvedValue({}),
      insert: vi.fn(),
      search: mockSearch,
    }));
    mockGetPages.mockReturnValue([]);

    const { GET } = await import('@/app/api/search/route');
    const response = await GET(new Request('http://localhost/api/search'));

    expect(mockSearch).toHaveBeenCalledWith({}, { term: '', limit: 10 });
    expect(await response.json()).toEqual([
      { id: '/column/a#h', url: '/column/a#h', type: 'heading', content: 'H' },
    ]);
  });

  it('builds the search index only once', async () => {
    const mockCreate = vi.fn().mockResolvedValue({});
    vi.doMock('@orama/orama', () => ({
      create: mockCreate,
      insert: vi.fn(),
      search: vi.fn().mockResolvedValue({ hits: [] }),
    }));
    mockGetPages.mockReturnValue([]);

    const { GET } = await import('@/app/api/search/route');
    await GET(new Request('http://localhost/api/search?query=a'));
    await GET(new Request('http://localhost/api/search?query=b'));

    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('reports a generic message for non-Error failures', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.doMock('@orama/orama', () => ({
      create: vi.fn().mockRejectedValue('boom'),
      insert: vi.fn(),
      search: vi.fn(),
    }));
    mockGetPages.mockReturnValue([]);

    const { GET } = await import('@/app/api/search/route');
    const response = await GET(
      new Request('http://localhost/api/search?query=a'),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Unknown search error' });
  });
});
