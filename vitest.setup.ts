/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest';

// jsdom does not implement matchMedia; default to no media query matching
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Graph data is cached at module level; start every test with a cold cache
beforeEach(async () => {
  const { resetGraphDataCache } =
    await import('@/components/graph/useGraphData');
  resetGraphDataCache();
});

// Next ships a React canary with <ViewTransition>; the react package the tests
// run against doesn't export it yet, so render its children directly
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    default: actual,
    ViewTransition: ({ children }: { children: React.ReactNode }) => children,
  };
});
