import { describe, it, expect, vi, beforeEach } from 'vitest';

const imageResponseArgs: any[] = [];

vi.mock('next/og', () => ({
  ImageResponse: class {
    constructor(...args: any[]) {
      imageResponseArgs.push(args);
    }
  },
}));

vi.mock('fumadocs-ui/og', () => ({ generate: () => null }));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/lib/source', () => ({
  source: {
    getPage: (slug: string[]) =>
      slug.join('/') === 'guide/intro'
        ? { data: { title: 'Intro', description: 'Getting started' } }
        : undefined,
    getPages: () => [
      { locale: undefined, slugs: ['guide', 'intro'] },
      { locale: 'fr', slugs: [] },
    ],
  },
  getPageImage: (page: { slugs: string[] }) => ({
    segments: [...page.slugs, 'image.png'],
  }),
}));

const routeContext = (slug: string[]) =>
  ({ params: Promise.resolve({ slug }) }) as any;

describe('GET /og/docs/[...slug]', () => {
  beforeEach(() => {
    imageResponseArgs.length = 0;
  });

  it('renders an image for the page, ignoring the trailing image segment', async () => {
    const { GET } = await import('@/app/og/docs/[...slug]/route');
    await GET(
      new Request('http://localhost'),
      routeContext(['guide', 'intro', 'image.png']),
    );

    const [element, options] = imageResponseArgs[0];
    expect(element.props).toEqual({
      title: 'Intro',
      description: 'Getting started',
      site: 'My App',
    });
    expect(options).toEqual({ width: 1200, height: 630 });
  });

  it('calls notFound for unknown pages', async () => {
    const { GET } = await import('@/app/og/docs/[...slug]/route');
    await expect(
      GET(new Request('http://localhost'), routeContext(['nope', 'image.png'])),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(imageResponseArgs).toHaveLength(0);
  });

  it('generates a static param for every page image', async () => {
    const { generateStaticParams } =
      await import('@/app/og/docs/[...slug]/route');
    expect(generateStaticParams()).toEqual([
      { lang: undefined, slug: ['guide', 'intro', 'image.png'] },
      { lang: 'fr', slug: ['image.png'] },
    ]);
  });
});
