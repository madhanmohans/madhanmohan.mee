import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { ChessKing, HomeIcon } from 'lucide-react';

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
        <ChessKing />
        </span>
      ),
    },
    themeSwitch: {
      enabled: true,
    },
  };
}
