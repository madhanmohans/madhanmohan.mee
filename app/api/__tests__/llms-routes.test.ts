import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('GET /llms.txt', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('lists all pages with title and description', async () => {
    vi.doMock('@/lib/source', () => ({
      source: {
        getPages: () => [
          {
            url: '/docs/page-a',
            data: { title: 'Page A', description: 'Desc A' },
          },
          {
            url: '/docs/page-b',
            data: { title: 'Page B', description: 'Desc B' },
          },
        ],
      },
    }));

    const { GET } = await import('@/app/llms.txt/route');
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('- [Page A](/docs/page-a): Desc A');
    expect(text).toContain('- [Page B](/docs/page-b): Desc B');
  });

  it('handles empty pages', async () => {
    vi.doMock('@/lib/source', () => ({
      source: {
        getPages: () => [],
      },
    }));

    const { GET } = await import('@/app/llms.txt/route');
    const response = await GET();
    const text = await response.text();

    expect(text).toBe('# Documentation\n');
  });
});

describe('GET /llms-full.txt', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('joins all LLM texts', async () => {
    vi.doMock('@/lib/source', () => ({
      source: {
        getPages: () => [
          {
            url: '/docs/a',
            data: {
              getText: () => Promise.resolve('processed A'),
              title: 'Page A',
            },
          },
          {
            url: '/docs/b',
            data: {
              getText: () => Promise.resolve('processed B'),
              title: 'Page B',
            },
          },
        ],
      },
      getLLMText: (page: any) =>
        page.data.getText('processed').then(
          (text: string) => `# ${page.data.title}\n\n${text}`,
        ),
    }));

    const { GET } = await import('@/app/llms-full.txt/route');
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('# Page A');
    expect(text).toContain('processed A');
    expect(text).toContain('# Page B');
    expect(text).toContain('processed B');
  });
});
