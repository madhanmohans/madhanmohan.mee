import { TourStep } from "@/components/Tour"

export const aboutPageTourStep: TourStep = {
    id: 'about',
    title: 'about',
    body: "who i am and what i'm currently thinking about.",
    selector: '[data-tour="about"]',
    placement: 'bottom',
}

export const welcomePageTourStep: TourStep = {
    id: 'welcome',
    title: 'welcome.',
    body: 'a personal second brain — notes, a knowledge graph, and a place where ideas connect.',
    placement: 'center',
}

export const secondBrainPageTourStep: TourStep =
{
    id: 'second-brain',
    title: 'second brain',
    body: 'an interactive knowledge graph. nodes are notes, edges are the connections between them.',
    selector: '[data-tour="second-brain"]',
    placement: 'bottom',
}
