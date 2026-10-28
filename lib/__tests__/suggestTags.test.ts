import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  LocalLLMError,
  parseSuggestedTags,
  suggestTags,
} from '@/lib/suggestTags';

describe('parseSuggestedTags', () => {
  it('parses a bare JSON array', () => {
    expect(parseSuggestedTags('["React", "#hooks"]')).toEqual([
      'react',
      'hooks',
    ]);
  });

  it('finds the array inside prose and code fences', () => {
    expect(
      parseSuggestedTags('Sure!\n```json\n["ml", "optimizers"]\n```'),
    ).toEqual(['ml', 'optimizers']);
  });

  it('caps the number of tags', () => {
    expect(parseSuggestedTags('["a","b","c","d","e","f","g"]')).toHaveLength(5);
  });

  it('returns [] for unparseable replies', () => {
    expect(parseSuggestedTags('no idea')).toEqual([]);
    expect(parseSuggestedTags('[not json]')).toEqual([]);
  });
});

describe('suggestTags', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the note and existing tags to the local LLM', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: '["ml", "activation"]' } }],
        }),
      ),
    );
    vi.stubGlobal('fetch', mockFetch);

    const tags = await suggestTags({
      title: 'relu',
      content: 'f(x) = max(0, x)',
      existingTags: ['ml', 'react'],
    });

    expect(tags).toEqual(['ml', 'activation']);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('http://localhost:11434/v1/chat/completions');
    const prompt = JSON.parse(init.body).messages[1].content;
    expect(prompt).toContain('Title: relu');
    expect(prompt).toContain('ml, react');
  });

  it('throws LocalLLMError when the server is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('fetch failed')),
    );
    await expect(
      suggestTags({ title: 't', content: 'c', existingTags: [] }),
    ).rejects.toBeInstanceOf(LocalLLMError);
  });
});
