import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

describe('app icon', () => {
  const iconPath = path.resolve(__dirname, '..', 'icon.svg');

  it('exists as a Next.js file-convention icon', () => {
    expect(existsSync(iconPath)).toBe(true);
  });

  it('is a valid SVG with a viewBox', () => {
    const svg = readFileSync(iconPath, 'utf8');
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox');
    expect(svg.trim().endsWith('</svg>')).toBe(true);
  });
});
