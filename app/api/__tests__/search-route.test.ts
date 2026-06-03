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
});
