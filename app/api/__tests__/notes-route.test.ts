import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetPage = vi.fn();
const mockReadFile = vi.fn();
const mockWriteFile = vi.fn();
const mockRevalidatePath = vi.fn();

vi.mock('@/lib/source', () => ({
  source: {
    getPage: mockGetPage,
  },
}));

vi.mock('node:fs/promises', () => ({
  readFile: mockReadFile,
  writeFile: mockWriteFile,
  default: { readFile: mockReadFile, writeFile: mockWriteFile },
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

function setupDevEnv() {
  vi.stubGlobal('process', {
    ...process,
    env: { ...process.env, NODE_ENV: 'development' },
    cwd: () => '/root',
  });
}

function setupProdEnv() {
  vi.stubGlobal('process', {
    ...process,
    env: { ...process.env, NODE_ENV: 'production' },
    cwd: () => '/root',
  });
}

describe('GET /api/notes/[...slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 403 when not in development', async () => {
    setupProdEnv();

    const { GET } = await import('@/app/api/notes/[...slug]/route');
    const response = await GET(
      new Request('http://localhost/api/notes/test'),
      { params: Promise.resolve({ slug: ['test'] }) },
    );

    expect(response.status).toBe(403);
    expect(await response.text()).toBe('Not available');
  });

  it('returns 404 when page not found', async () => {
    setupDevEnv();
    mockGetPage.mockReturnValue(null);

    const { GET } = await import('@/app/api/notes/[...slug]/route');
    const response = await GET(
      new Request('http://localhost/api/notes/nonexistent'),
      { params: Promise.resolve({ slug: ['nonexistent'] }) },
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Not found');
  });

  it('returns file content for existing page', async () => {
    setupDevEnv();
    mockGetPage.mockReturnValue({ path: 'test.md' });
    mockReadFile.mockResolvedValue('# Test Content');

    const { GET } = await import('@/app/api/notes/[...slug]/route');
    const response = await GET(
      new Request('http://localhost/api/notes/test'),
      { params: Promise.resolve({ slug: ['test'] }) },
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('# Test Content');
  });
});

describe('PUT /api/notes/[...slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 403 when not in development', async () => {
    setupProdEnv();

    const { PUT } = await import('@/app/api/notes/[...slug]/route');
    const response = await PUT(
      new Request('http://localhost/api/notes/test', {
        method: 'PUT',
        body: 'Updated',
      }),
      { params: Promise.resolve({ slug: ['test'] }) },
    );

    expect(response.status).toBe(403);
  });

  it('returns 404 when page not found', async () => {
    setupDevEnv();
    mockGetPage.mockReturnValue(null);

    const { PUT } = await import('@/app/api/notes/[...slug]/route');
    const response = await PUT(
      new Request('http://localhost/api/notes/nonexistent', {
        method: 'PUT',
        body: 'Content',
      }),
      { params: Promise.resolve({ slug: ['nonexistent'] }) },
    );

    expect(response.status).toBe(404);
  });

  it('writes content and revalidates', async () => {
    setupDevEnv();
    mockGetPage.mockReturnValue({
      path: 'test.md',
      url: '/docs/test',
    });
    mockWriteFile.mockResolvedValue(undefined);

    const { PUT } = await import('@/app/api/notes/[...slug]/route');
    const response = await PUT(
      new Request('http://localhost/api/notes/test', {
        method: 'PUT',
        body: '# Updated',
      }),
      { params: Promise.resolve({ slug: ['test'] }) },
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ ok: true });
    expect(mockWriteFile).toHaveBeenCalled();
    expect(mockRevalidatePath).toHaveBeenCalledWith('/docs/test');
  });
});
