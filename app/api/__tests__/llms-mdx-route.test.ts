import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('GET /llms.mdx/docs/[...slug]', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns page content as markdown', async () => {
    vi.doMock('@/lib/source', () => ({
      source: {
        getPage: (slug: string[]) =>
          slug[0] === 'test'
            ? {
                url: '/docs/test',
                slugs: ['test'],
                data: {
                  title: 'Test Page',
                  getText: () => Promise.resolve('## Section\n\nContent'),
                },
              }
            : undefined,
      },
      getLLMText: (page: any) =>
        page.data
          .getText('processed')
          .then((text: string) => `# ${page.data.title}\n\n${text}`),
    }));

    vi.doMock('next/navigation', () => ({
      notFound: vi.fn(() => {
        throw new Error('NEXT_NOT_FOUND');
      }),
    }));

    const { GET } = await import('@/app/llms.mdx/docs/[[...slug]]/route');
    const response = await GET(
      new Request('http://localhost/llms.mdx/docs/test'),
      { params: Promise.resolve({ slug: ['test'] }) },
    );
    const text = await response.text();

    expect(response.headers.get('Content-Type')).toBe('text/markdown');
    expect(text).toContain('# Test Page');
    expect(text).toContain('## Section');
  });
});
