import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';

function setupEnv(NODE_ENV: string) {
  vi.stubGlobal('process', { ...process, env: { ...process.env, NODE_ENV } });
}

function request(headers: Record<string, string>) {
  return new Request('http://localhost:3000/api/notes', {
    method: 'POST',
    headers,
  });
}

describe('isAllowedDevRequest', () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllGlobals());

  it('rejects every request outside development', async () => {
    setupEnv('production');
    const { isAllowedDevRequest } = await import('@/lib/devRequest');
    expect(isAllowedDevRequest(request({}))).toBe(false);
  });

  it('allows same-origin and origin-less requests in development', async () => {
    setupEnv('development');
    const { isAllowedDevRequest } = await import('@/lib/devRequest');
    expect(isAllowedDevRequest(request({}))).toBe(true);
    expect(
      isAllowedDevRequest(
        request({ origin: 'http://localhost:3000', host: 'localhost:3000' }),
      ),
    ).toBe(true);
  });

  it('rejects cross-origin requests in development', async () => {
    setupEnv('development');
    const { isAllowedDevRequest } = await import('@/lib/devRequest');
    expect(
      isAllowedDevRequest(
        request({ origin: 'https://evil.example', host: 'localhost:3000' }),
      ),
    ).toBe(false);
    expect(
      isAllowedDevRequest(request({ origin: 'null', host: 'localhost:3000' })),
    ).toBe(false);
  });
});

describe('resolveInside', () => {
  const directory = path.resolve('/root/content/docs');

  it('resolves paths inside the directory', async () => {
    const { resolveInside } = await import('@/lib/devRequest');
    expect(resolveInside(directory, 'a/b.md')).toBe(
      path.join(directory, 'a/b.md'),
    );
  });

  it('rejects traversal and prefix-sharing siblings', async () => {
    const { resolveInside } = await import('@/lib/devRequest');
    expect(() => resolveInside(directory, '../secret.md')).toThrow();
    expect(() => resolveInside(directory, '../docs-other/x.md')).toThrow();
  });
});
