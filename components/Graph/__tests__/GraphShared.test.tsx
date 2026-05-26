import { describe, it, expect, vi } from 'vitest';
import {
  stripInlineMarkdown,
  enrichGraphNodesWithNeighbors,
  createForceGraphRef,
} from '@/components/Graph/GraphShared';

describe('stripInlineMarkdown', () => {
  it('removes markdown links', () => {
    expect(stripInlineMarkdown('text [link](url) more')).toBe('text link more');
  });

  it('removes wikilinks', () => {
    expect(stripInlineMarkdown('text [[wikilink]] more')).toBe(
      'text wikilink more',
    );
  });

  it('removes bold and italic', () => {
    expect(stripInlineMarkdown('**bold** *italic*')).toBe('bold italic');
  });

  it('removes underscore bold/italic', () => {
    expect(stripInlineMarkdown('__bold__ _italic_')).toBe('bold italic');
  });

  it('handles empty string', () => {
    expect(stripInlineMarkdown('')).toBe('');
  });

  it('handles string without markdown', () => {
    expect(stripInlineMarkdown('plain text')).toBe('plain text');
  });
});

describe('enrichGraphNodesWithNeighbors', () => {
  const graph = {
    nodes: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
    ],
    links: [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ],
  };

  it('adds neighbors to each node via deep clone', () => {
    const result = enrichGraphNodesWithNeighbors(graph);
    const nodeA = result.nodes.find((n) => n.id === 'a')!;
    const nodeB = result.nodes.find((n) => n.id === 'b')!;
    const nodeC = result.nodes.find((n) => n.id === 'c')!;

    expect(nodeA.neighbors).toEqual(['b']);
    expect(nodeB.neighbors).toEqual(['a', 'c']);
    expect(nodeC.neighbors).toEqual(['b']);
  });

  it('does not mutate the original graph', () => {
    const originalClone = structuredClone(graph);
    enrichGraphNodesWithNeighbors(graph);
    expect(graph).toEqual(originalClone);
  });

  it('handles empty graph', () => {
    const result = enrichGraphNodesWithNeighbors({ nodes: [], links: [] });
    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });

  it('handles node with no links', () => {
    const result = enrichGraphNodesWithNeighbors({
      nodes: [{ id: 'orphan', text: 'O' }],
      links: [],
    });
    expect(result.nodes[0].neighbors).toEqual([]);
  });
});

describe('createForceGraphRef', () => {
  it('creates a ref-like object from a MutableRefObject', () => {
    const ref = { current: undefined as any };
    const initFn = vi.fn();
    const graphRef = createForceGraphRef(ref, initFn);

    expect(graphRef.current).toBeUndefined();
    graphRef.current = 'instance';
    expect(ref.current).toBe('instance');
    expect(initFn).toHaveBeenCalledWith('instance');
  });

  it('does not call init if undefined', () => {
    const ref = { current: undefined as any };
    const initFn = vi.fn();
    const graphRef = createForceGraphRef(ref, initFn);

    graphRef.current = undefined;
    expect(initFn).not.toHaveBeenCalled();
  });

  it('works without an init callback', () => {
    const ref = { current: undefined as any };
    const graphRef = createForceGraphRef(ref);
    graphRef.current = 'val';
    expect(ref.current).toBe('val');
  });
});
