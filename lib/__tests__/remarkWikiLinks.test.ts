import { remarkWikilinks } from '@/lib/remarkWikiLinks';
import type { Root, Text, Link } from 'mdast';
import { describe, it, expect } from 'vitest';

function createRoot(texts: string[]): Root {
  return {
    type: 'root',
    children: texts.map((t) => ({ type: 'text' as const, value: t })),
  };
}

function transform(text: string): Root {
  const tree = createRoot([text]);
  remarkWikilinks()(tree, null as any, () => {});
  return tree;
}

describe('remarkWikilinks', () => {
  it('converts [[SimpleLink]] to a link', () => {
    const result = transform('Hello [[Target]] world');
    const link = result.children.find((c): c is Link => c.type === 'link')!;
    expect(link).toBeDefined();
    expect(link.url).toBe('target');
    expect((link.children[0] as Text).value).toBe('Target');
  });

  it('converts [[Target|Display Name]] with alias', () => {
    const result = transform('See [[Note Title|Display Name]]');
    const link = result.children.find((c): c is Link => c.type === 'link')!;
    expect(link).toBeDefined();
    expect(link.url).toBe('note-title');
    expect((link.children[0] as Text).value).toBe('Display Name');
  });

  it('does not match image wikilinks (![[...]])', () => {
    const result = transform('This is ![[image.png]]');
    expect(result.children).toHaveLength(1);
    expect((result.children[0] as Text).value).toBe('This is ![[image.png]]');
  });

  it('handles text without wikilinks', () => {
    const result = transform('Plain text');
    expect(result.children).toHaveLength(1);
    expect((result.children[0] as Text).value).toBe('Plain text');
  });

  it('handles empty string', () => {
    const result = transform('');
    expect(result.children).toHaveLength(1);
    expect((result.children[0] as Text).value).toBe('');
  });

  it('generates correct slug from target', () => {
    const result = transform('[[Hello World!]]');
    const link = result.children.find((c): c is Link => c.type === 'link')!;
    expect(link).toBeDefined();
    expect(link.url).toBe('hello-world');
  });

  it('strips special characters from slug', () => {
    const result = transform("[[What's New?]]");
    const link = result.children.find((c): c is Link => c.type === 'link')!;
    expect(link).toBeDefined();
    expect(link.url).toBe('whats-new');
  });

  it('trims whitespace from target and alias', () => {
    const result = transform('[[  spaced  |  alias  ]]');
    const link = result.children.find((c): c is Link => c.type === 'link')!;
    expect(link).toBeDefined();
    expect(link.url).toBe('spaced');
    expect((link.children[0] as Text).value).toBe('alias');
  });

  it('preserves text between wikilinks', () => {
    const result = transform('[[A]] and [[B|Bee]]');
    const links = result.children.filter((c): c is Link => c.type === 'link');
    expect(links).toHaveLength(2);
    expect(links[0].url).toBe('a');
    expect((links[0].children[0] as Text).value).toBe('A');
    expect(links[1].url).toBe('b');
    expect((links[1].children[0] as Text).value).toBe('Bee');

    const textNodes = result.children.filter(
      (c): c is Text => c.type === 'text',
    );
    const textValues = textNodes.map((t) => t.value);
    expect(textValues).toEqual([' and ']);
  });

  it('handles text after last wikilink', () => {
    const result = transform('[[A]] trailing');
    const link = result.children.find((c): c is Link => c.type === 'link')!;
    expect(link).toBeDefined();
    expect(link.url).toBe('a');

    const textNodes = result.children.filter(
      (c): c is Text => c.type === 'text',
    );
    expect(textNodes.some((t) => t.value.includes('trailing'))).toBe(true);
  });
});
