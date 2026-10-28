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
