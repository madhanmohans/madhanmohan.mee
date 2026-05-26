import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockCompile = vi.fn();

vi.mock('@fumadocs/mdx-remote', () => ({
  createCompiler: vi.fn(() => ({
    compile: mockCompile,
  })),
}));

function setupDevEnv() {
  vi.stubGlobal('process', {
    ...process,
    env: { ...process.env, NODE_ENV: 'development' },
  });
}

function setupProdEnv() {
  vi.stubGlobal('process', {
    ...process,
    env: { ...process.env, NODE_ENV: 'production' },
  });
}

describe('POST /api/preview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 403 when not in development', async () => {
    setupProdEnv();

    const { POST } = await import('@/app/api/preview/route');
    const request = new Request('http://localhost/api/preview', {
      method: 'POST',
      body: JSON.stringify({ content: '# Hello' }),
    });
    const response = await POST(request);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe('Not available');
  });

  it('returns 400 for invalid content', async () => {
    setupDevEnv();

    const { POST } = await import('@/app/api/preview/route');
    const request = new Request('http://localhost/api/preview', {
      method: 'POST',
      body: JSON.stringify({ content: 123 }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid content');
  });

  it('compiles MDX content and returns compiled result', async () => {
    setupDevEnv();
    mockCompile.mockResolvedValue({ compiled: '<h1>Hello</h1>' });

    const { POST } = await import('@/app/api/preview/route');
    const request = new Request('http://localhost/api/preview', {
      method: 'POST',
      body: JSON.stringify({ content: '# Hello' }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(body.compiled).toBe('<h1>Hello</h1>');
    expect(mockCompile).toHaveBeenCalledWith({ source: '# Hello' });
  });

  it('returns 422 on compilation error', async () => {
    setupDevEnv();
    mockCompile.mockRejectedValue(new Error('Syntax error'));

    const { POST } = await import('@/app/api/preview/route');
    const request = new Request('http://localhost/api/preview', {
      method: 'POST',
      body: JSON.stringify({ content: '# Bad ' }),
    });
    const response = await POST(request);

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.error).toBe('Syntax error');
  });
});
