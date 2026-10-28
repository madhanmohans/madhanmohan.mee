import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

const mockNotFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});

const testPage = {
  url: '/note/test',
  slugs: ['test'],
  data: {
    title: 'Test Page',
    description: 'A test description',
    toc: [],
    full: false,
    tags: ['ml'],
    body: () => React.createElement('p', null, 'Body content'),
  },
};

vi.mock('@/lib/source', () => ({
  source: {
    getPage: (slug?: string[]) => (slug?.[0] === 'test' ? testPage : undefined),
    generateParams: () => [{ slug: ['test'] }],
  },
  getPageImage: () => ({ url: '/og/note/test/image.png' }),
  getTagGroups: () => [
    { tag: 'ml', notes: [{ url: '/note/test', title: 'Test Page' }] },
  ],
}));

vi.mock('next/navigation', () => ({ notFound: mockNotFound }));

vi.mock('fumadocs-ui/layouts/docs/page', () => ({
  DocsPage: ({ children, tableOfContent }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'docs-page' },
      tableOfContent.header,
      children,
    ),
  DocsTitle: ({ children }: any) => React.createElement('h1', null, children),
  DocsDescription: ({ children }: any) =>
    React.createElement('p', null, children),
  DocsBody: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'docs-body' }, children),
}));

vi.mock('fumadocs-ui/mdx', () => ({
  default: {},
  createRelativeLink: () => () => null,
}));

vi.mock('@/components/page-actions/CopyMarkdownButton', () => ({
  CopyMarkdownButton: ({ markdownUrl }: any) =>
    React.createElement('button', { 'data-testid': 'copy' }, markdownUrl),
}));
vi.mock('@/components/page-actions/OpenInAiMenu', () => ({
  OpenInAiMenu: ({ markdownUrl }: any) =>
    React.createElement('button', { 'data-testid': 'view' }, markdownUrl),
}));

vi.mock('@/components/editor/NoteEditor', () => ({
  NoteEditor: ({ children, slug }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'note-editor', 'data-slug': slug.join('/') },
      children,
    ),
}));

vi.mock('@/components/tags/NoteTags', () => ({
  NoteTags: ({ tags, editable }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'note-tags', 'data-editable': String(editable) },
      tags.join(','),
    ),
}));
vi.mock('@/components/tags/TagGroups', () => ({
  TagGroups: ({ groups, currentTags }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'tag-groups', 'data-current': currentTags.join(',') },
      groups.map((g: any) => g.tag).join(','),
    ),
}));
vi.mock('@/components/tour/NotesTour', () => ({ NotesTour: () => null }));
vi.mock('@/components/layout/ViewToggle', () => ({ ViewToggle: () => null }));
vi.mock('@/components/graph/local/LocalGraph', () => ({
  LocalGraph: ({ pageUrl }: any) =>
    React.createElement('div', { 'data-testid': 'graph-mini' }, pageUrl),
}));

const pageProps = (slug?: string[]) =>
  ({ params: Promise.resolve({ slug }) }) as any;

describe('Note page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders the page title, description, actions and body', async () => {
    const { default: Page } = await import('@/app/note/[[...slug]]/page');
    render(await Page(pageProps(['test'])));

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByTestId('copy')).toHaveTextContent('/note/test.mdx');
    expect(screen.getByTestId('view')).toHaveTextContent('/note/test.mdx');
    expect(screen.getByTestId('graph-mini')).toHaveTextContent('/note/test');
    expect(screen.queryByTestId('note-editor')).not.toBeInTheDocument();
    expect(screen.getByTestId('note-tags')).toHaveTextContent('ml');
    expect(screen.getByTestId('note-tags')).toHaveAttribute(
      'data-editable',
      'false',
    );
    expect(screen.getByTestId('tag-groups')).toHaveAttribute(
      'data-current',
      'ml',
    );
  });

  it('wraps the body in the note editor during development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { default: Page } = await import('@/app/note/[[...slug]]/page');
    render(await Page(pageProps(['test'])));

    const editor = screen.getByTestId('note-editor');
    expect(editor).toHaveAttribute('data-slug', 'test');
    expect(editor).toHaveTextContent('Body content');
  });

  it('calls notFound for unknown pages', async () => {
    const { default: Page } = await import('@/app/note/[[...slug]]/page');
    await expect(Page(pageProps(['missing']))).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
    expect(mockNotFound).toHaveBeenCalled();
  });

  it('generates static params from the source', async () => {
    const { generateStaticParams } =
      await import('@/app/note/[[...slug]]/page');
    expect(await generateStaticParams()).toEqual([{ slug: ['test'] }]);
  });

  it('generates metadata with the open graph image', async () => {
    const { generateMetadata } = await import('@/app/note/[[...slug]]/page');
    expect(await generateMetadata(pageProps(['test']))).toEqual({
      title: 'Test Page',
      description: 'A test description',
      openGraph: { images: '/og/note/test/image.png' },
    });
  });

  it('calls notFound when generating metadata for unknown pages', async () => {
    const { generateMetadata } = await import('@/app/note/[[...slug]]/page');
    await expect(generateMetadata(pageProps(['missing']))).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });
});
