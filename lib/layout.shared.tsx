import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span style={{
          fontFamily: "'Times New Roman', Georgia, serif",
          fontSize: '18px',
          fontWeight: 400,
          letterSpacing: '0.02em',
        }}>
          Notes.
        </span>
      ),
    },
    themeSwitch: {
      enabled: true,
    },
  };
}
