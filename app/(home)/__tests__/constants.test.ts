import {
  aboutPageTourStep,
  welcomePageTourStep,
  secondBrainPageTourStep,
} from '@/app/(home)/constants';

describe('home page tour constants', () => {
  it('aboutPageTourStep has correct id', () => {
    expect(aboutPageTourStep.id).toBe('about');
    expect(aboutPageTourStep.selector).toBe('[data-tour="about"]');
    expect(aboutPageTourStep.placement).toBe('bottom');
  });

  it('welcomePageTourStep has correct id', () => {
    expect(welcomePageTourStep.id).toBe('welcome');
    expect(welcomePageTourStep.placement).toBe('center');
  });

  it('secondBrainPageTourStep has correct id', () => {
    expect(secondBrainPageTourStep.id).toBe('second-brain');
    expect(secondBrainPageTourStep.selector).toBe(
      '[data-tour="second-brain"]',
    );
    expect(secondBrainPageTourStep.placement).toBe('bottom');
  });
});
