import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BrainCircuit } from 'lucide-react';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <BrainCircuit />
      ),
    },
    themeSwitch: {
      enabled: true,
    },
  };
}
