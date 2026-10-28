import path from 'node:path';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// The editing routes write to disk, so they only run under `next dev`, and
// only for requests from the app itself: any other site open in the browser
// could otherwise POST to localhost:3000
export function isAllowedDevRequest(request: Request): boolean {
  if (!IS_DEVELOPMENT) return false;

  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

// Resolves a page path inside the directory, rejecting `..` escapes and
// sibling directories that share the prefix (content/docs-other)
export function resolveInside(directory: string, pagePath: string): string {
  const resolvedPath = path.resolve(directory, pagePath);
  if (!resolvedPath.startsWith(directory + path.sep)) {
    throw new Error('Invalid path');
  }
  return resolvedPath;
}
