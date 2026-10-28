import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TagGroups } from '@/components/TagGroups';

const groups = [
  {
    tag: 'ml',
    notes: [
      { url: '/column/adam', title: 'Adam' },
      { url: '/column/relu', title: 'Relu' },
    ],
  },
  { tag: 'react', notes: [{ url: '/column/hooks', title: 'Hooks' }] },
];

describe('TagGroups', () => {
  it('renders nothing when there are no tags', () => {
    const { container } = render(
      <TagGroups groups={[]} currentTags={[]} currentUrl="/column/x" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists the current note tags first and marks them active', () => {
    render(
      <TagGroups
        groups={groups}
        currentTags={['react']}
        currentUrl="/column/hooks"
      />,
    );

    const rows = screen.getAllByRole('button');
    expect(rows[0]).toHaveTextContent('react1');
    expect(rows[0]).toHaveAttribute('data-active', 'true');
    expect(rows[1]).toHaveTextContent('ml2');
    expect(rows[1]).toHaveAttribute('data-active', 'false');
  });

  it('expands a group to show its notes', () => {
    render(
      <TagGroups groups={groups} currentTags={[]} currentUrl="/column/relu" />,
    );

    expect(screen.queryByText('Adam')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /ml/ }));

    expect(screen.getByRole('link', { name: 'Adam' })).toHaveAttribute(
      'href',
      '/column/adam',
    );
    expect(screen.getByRole('link', { name: 'Relu' })).toHaveAttribute(
      'data-current',
      'true',
    );
  });
});
