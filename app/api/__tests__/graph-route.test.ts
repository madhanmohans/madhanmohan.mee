import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockBuildGraph = vi.fn();

vi.mock('@/lib/buildGraph', () => ({
  buildGraph: mockBuildGraph,
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(
      (data) =>
        new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        }),
    ),
  },
}));

describe('GET /api/graph', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns graph JSON', async () => {
    const graphData = {
      nodes: [{ id: '/column/test', text: 'Test' }],
      links: [],
    };
    mockBuildGraph.mockResolvedValue(graphData);

    const { GET } = await import('@/app/api/graph/route');
    const response = await GET();
    const body = await response.json();

    expect(body).toEqual(graphData);
    expect(mockBuildGraph).toHaveBeenCalledOnce();
  });

  it('handles empty graph', async () => {
    mockBuildGraph.mockResolvedValue({ nodes: [], links: [] });

    const { GET } = await import('@/app/api/graph/route');
    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ nodes: [], links: [] });
  });
});
