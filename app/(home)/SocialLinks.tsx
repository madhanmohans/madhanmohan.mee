import { Crown, Orbit, Pin, type LucideIcon } from 'lucide-react';
import { socialLinks } from './constants';

const icons: Record<string, LucideIcon> = {
  chess: Crown,
  pinterest: Pin,
  cosmos: Orbit,
};

export function SocialLinks() {
  return (
    <ul className="flex gap-4" aria-label="social links">
      {socialLinks.map(({ id, label, href }) => {
        const Icon = icons[id];
        return (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-150"
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
