import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockWriteFile = vi.fn();

vi.mock('node:fs/promises', () => ({
  writeFile: mockWriteFile,
  default: { writeFile: mockWriteFile },
}));

function setupEnv(NODE_ENV: string) {
  vi.stubGlobal('process', {
    ...process,
    env: { ...process.env, NODE_ENV },
    cwd: () => '/root',
  });
}

function postNote(body: unknown) {
  return new Request('http://localhost/api/notes', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/notes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 403 when not in development', async () => {
    setupEnv('production');

    const { POST } = await import('@/app/api/notes/route');
    const response = await POST(postNote({ title: 'A', content: '' }));

    expect(response.status).toBe(403);
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('creates a slugified markdown file without overwriting', async () => {
    setupEnv('development');
    mockWriteFile.mockResolvedValue(undefined);

    const { POST } = await import('@/app/api/notes/route');
    const response = await POST(
      postNote({ title: 'Ideas: Flowing (Big)', content: '# Hi' }),
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      slug: 'ideas-flowing-big',
      url: '/note/ideas-flowing-big',
    });
    expect(mockWriteFile).toHaveBeenCalledWith(
      '/root/content/docs/ideas-flowing-big.md',
      '# Hi',
      { encoding: 'utf-8', flag: 'wx' },
    );
  });

  it('returns 409 when the note already exists', async () => {
    setupEnv('development');
    mockWriteFile.mockRejectedValue(
      Object.assign(new Error('exists'), { code: 'EEXIST' }),
    );

    const { POST } = await import('@/app/api/notes/route');
    const response = await POST(postNote({ title: 'relu', content: '' }));

    expect(response.status).toBe(409);
    expect((await response.json()).error).toContain('relu');
  });

  it.each([
    ['an empty title', { title: '  ?! ', content: '' }],
    ['a missing content field', { title: 'A' }],
    ['a body that is not JSON', 'not json'],
  ])('returns 400 for %s', async (_label, body) => {
    setupEnv('development');

    const { POST } = await import('@/app/api/notes/route');
    const response = await POST(postNote(body));

    expect(response.status).toBe(400);
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('rejects titles that would leave the content directory', async () => {
    setupEnv('development');

    const { POST } = await import('@/app/api/notes/route');
    const response = await POST(
      postNote({ title: '../../etc/x', content: '' }),
    );

    expect(response.status).toBe(400);
    expect(mockWriteFile).not.toHaveBeenCalled();
  });
});
