import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockGetPage = vi.fn();
const mockGetTagGroups = vi.fn();
const mockReadFile = vi.fn();
const mockWriteFile = vi.fn();
const mockSuggestTags = vi.fn();

vi.mock('@/lib/source', () => ({
  source: { getPage: mockGetPage },
  getTagGroups: mockGetTagGroups,
}));

vi.mock('@/lib/suggestTags', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/suggestTags')>()),
  suggestTags: mockSuggestTags,
}));

vi.mock('node:fs/promises', () => ({
  readFile: mockReadFile,
  writeFile: mockWriteFile,
  default: { readFile: mockReadFile, writeFile: mockWriteFile },
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

function setupEnv(nodeEnv: string) {
  vi.stubGlobal('process', {
    ...process,
    env: { ...process.env, NODE_ENV: nodeEnv },
    cwd: () => '/root',
  });
}

function jsonRequest(method: string, body: unknown) {
  return new Request('http://localhost/api/tags', {
    method,
    body: JSON.stringify(body),
  });
}

const page = {
  path: 'relu.md',
  url: '/note/relu',
  data: { title: 'Relu', tags: ['ml'] },
};

describe('PUT /api/tags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 403 when not in development', async () => {
    setupEnv('production');
    const { PUT } = await import('@/app/api/tags/route');
    const response = await PUT(jsonRequest('PUT', { slug: [], tags: [] }));
    expect(response.status).toBe(403);
  });

  it('returns 400 for a malformed body', async () => {
    setupEnv('development');
    const { PUT } = await import('@/app/api/tags/route');
    const response = await PUT(jsonRequest('PUT', { slug: 'relu' }));
    expect(response.status).toBe(400);
  });

  it('writes normalized tags into the frontmatter', async () => {
    setupEnv('development');
    mockGetPage.mockReturnValue(page);
    mockReadFile.mockResolvedValue('# relu\n');
    const { PUT } = await import('@/app/api/tags/route');

    const response = await PUT(
      jsonRequest('PUT', {
        slug: ['relu'],
        tags: ['#ML', 'ml', 'Deep Learning'],
      }),
    );

    expect(await response.json()).toEqual({ tags: ['ml', 'deep-learning'] });
    expect(mockWriteFile).toHaveBeenCalledWith(
      '/root/content/docs/relu.md',
      '---\ntags:\n  - ml\n  - deep-learning\n---\n\n# relu\n',
      'utf-8',
    );
  });
});

describe('POST /api/tags/suggest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 404 for an unknown note', async () => {
    setupEnv('development');
    mockGetPage.mockReturnValue(undefined);
    const { POST } = await import('@/app/api/tags/suggest/route');
    const response = await POST(jsonRequest('POST', { slug: ['missing'] }));
    expect(response.status).toBe(404);
  });

  it('omits tags the note already has', async () => {
    setupEnv('development');
    mockGetPage.mockReturnValue(page);
    mockGetTagGroups.mockReturnValue([{ tag: 'ml', notes: [] }]);
    mockReadFile.mockResolvedValue('---\ntags:\n  - ml\n---\nf(x) = max(0, x)');
    mockSuggestTags.mockResolvedValue(['ml', 'activation-functions']);
    const { POST } = await import('@/app/api/tags/suggest/route');

    const response = await POST(jsonRequest('POST', { slug: ['relu'] }));

    expect(await response.json()).toEqual({ tags: ['activation-functions'] });
    expect(mockSuggestTags).toHaveBeenCalledWith({
      title: 'Relu',
      content: 'f(x) = max(0, x)',
      existingTags: ['ml'],
    });
  });

  it('returns 502 when the local LLM is down', async () => {
    setupEnv('development');
    mockGetPage.mockReturnValue(page);
    mockGetTagGroups.mockReturnValue([]);
    mockReadFile.mockResolvedValue('body');
    const { LocalLLMError } = await import('@/lib/suggestTags');
    mockSuggestTags.mockRejectedValue(new LocalLLMError('not running'));
    const { POST } = await import('@/app/api/tags/suggest/route');

    const response = await POST(jsonRequest('POST', { slug: ['relu'] }));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'not running' });
  });
});

describe('PUT /api/tags with inline tags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('strips removed inline tags and keeps the rest inline', async () => {
    setupEnv('development');
    mockGetPage.mockReturnValue({
      ...page,
      data: { ...page.data, tags: ['leetcode', 'dp'] },
    });
    mockReadFile.mockResolvedValue('Tags: #leetcode #dp\nbody');
    const { PUT } = await import('@/app/api/tags/route');

    await PUT(
      jsonRequest('PUT', { slug: ['x'], tags: ['leetcode', 'arrays'] }),
    );

    expect(mockWriteFile).toHaveBeenCalledWith(
      '/root/content/docs/relu.md',
      '---\ntags:\n  - arrays\n---\n\nTags: #leetcode\nbody',
      'utf-8',
    );
  });
});
