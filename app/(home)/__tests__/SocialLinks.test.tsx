import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SocialLinks } from '@/app/(home)/SocialLinks';
import { socialLinks } from '@/app/(home)/constants';

describe('SocialLinks', () => {
  it('renders chess, pinterest and cosmos links', () => {
    render(<SocialLinks />);
    expect(socialLinks.map((l) => l.id)).toEqual([
      'chess',
      'pinterest',
      'cosmos',
    ]);
    for (const { label, href } of socialLinks) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        href,
      );
    }
  });

  it('opens links safely in a new tab', () => {
    render(<SocialLinks />);
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });

  it('uses https URLs', () => {
    for (const { href } of socialLinks) expect(href).toMatch(/^https:\/\//);
  });
});
