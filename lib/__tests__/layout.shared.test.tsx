import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { baseOptions } from '@/lib/layout.shared';
import { getMDXComponents } from '@/MDXComponents';

describe('baseOptions', () => {
  it('enables the theme switch and renders an icon title', () => {
    const options = baseOptions();
    expect(options.themeSwitch).toEqual({ enabled: true });
    const { container } = render(<>{options.nav!.title}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('getMDXComponents', () => {
  it('renders images as plain img elements', () => {
    const Img = getMDXComponents().img as React.FC<any>;
    const { container } = render(<Img src="/a.png" alt="A" />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/a.png');
  });

  it('lets callers override components', () => {
    const Custom = () => null;
    expect(getMDXComponents({ a: Custom }).a).toBe(Custom);
  });
});
