import { remarkStripHeadingLinks } from '@/lib/remarkStripHeadingLinks';
import type { Root } from 'mdast';

describe('remarkStripHeadingLinks', () => {
  it('removes links from headings, keeping the text', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'link',
              url: '/some-page',
              children: [{ type: 'text', value: 'Clickable Title' }],
            },
          ],
        },
      ],
    };

    remarkStripHeadingLinks()(tree, null as any, () => {});
    const heading = tree.children[0] as any;
    expect(heading.children[0].type).toBe('text');
    expect(heading.children[0].value).toBe('Clickable Title');
  });

  it('does not modify headings without links', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'Plain Heading' }],
        },
      ],
    };

    remarkStripHeadingLinks()(tree, null as any, () => {});
    const heading = tree.children[0] as any;
    expect(heading.children).toHaveLength(1);
    expect(heading.children[0].value).toBe('Plain Heading');
  });

  it('handles empty tree', () => {
    const tree: Root = { type: 'root', children: [] };
    expect(() => {
      remarkStripHeadingLinks()(tree, null as any, () => {});
    }).not.toThrow();
  });

  it('preserves text before and after link in heading', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [
            { type: 'text', value: 'Before ' },
            {
              type: 'link',
              url: '/page',
              children: [{ type: 'text', value: 'Link' }],
            },
            { type: 'text', value: ' After' },
          ],
        },
      ],
    };

    remarkStripHeadingLinks()(tree, null as any, () => {});
    const heading = tree.children[0] as any;
    expect(heading.children).toHaveLength(3);
    expect(heading.children[0].value).toBe('Before ');
    expect(heading.children[1].value).toBe('Link');
    expect(heading.children[2].value).toBe(' After');
  });

  it('ignores links outside of headings', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: '/page',
              children: [{ type: 'text', value: 'paragraph link' }],
            },
          ],
        },
      ],
    };

    remarkStripHeadingLinks()(tree, null as any, () => {});
    const paragraph = tree.children[0] as any;
    expect(paragraph.children[0].type).toBe('link');
  });
});
