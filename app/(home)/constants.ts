import { TourStep } from '@/components/tour/Tour';

export const aboutPageTourStep: TourStep = {
  id: 'about',
  title: 'about',
  body: "who i am and what i'm currently thinking about.",
  selector: '[data-tour="about"]',
  placement: 'bottom',
};

export const welcomePageTourStep: TourStep = {
  id: 'welcome',
  title: 'welcome.',
  body: 'a personal second brain — notes, a knowledge graph, and a place where ideas connect.',
  placement: 'center',
};

export const secondBrainPageTourStep: TourStep = {
  id: 'second-brain',
  title: 'second brain',
  body: 'an interactive knowledge graph. nodes are notes, edges are the connections between them.',
  selector: '[data-tour="second-brain"]',
  placement: 'bottom',
};

export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

// TODO(issue #6): these profile URLs are best-guess placeholders (handle
// assumed to match the GitHub/LinkedIn handle). Replace with the real ones.
export const socialLinks: SocialLink[] = [
  {
    id: 'chess',
    label: 'chess.com',
    href: 'https://www.chess.com/member/madhanmohans',
  },
  {
    id: 'pinterest',
    label: 'pinterest',
    href: 'https://www.pinterest.com/madhanmohans/',
  },
  {
    id: 'cosmos',
    label: 'cosmos',
    href: 'https://www.cosmos.so/madhanmohans',
  },
];
