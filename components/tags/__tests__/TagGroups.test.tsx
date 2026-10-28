import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TagGroups } from '@/components/tags/TagGroups';

const groups = [
  {
    tag: 'ml',
    notes: [
      { url: '/note/adam', title: 'Adam' },
      { url: '/note/relu', title: 'Relu' },
    ],
  },
  { tag: 'react', notes: [{ url: '/note/hooks', title: 'Hooks' }] },
];

describe('TagGroups', () => {
  it('renders nothing when there are no tags', () => {
    const { container } = render(
      <TagGroups groups={[]} currentTags={[]} currentUrl="/note/x" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists the current note tags first and marks them active', () => {
    render(
      <TagGroups
        groups={groups}
        currentTags={['react']}
        currentUrl="/note/hooks"
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
      <TagGroups groups={groups} currentTags={[]} currentUrl="/note/relu" />,
    );

    expect(screen.queryByText('Adam')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /ml/ }));

    expect(screen.getByRole('link', { name: 'Adam' })).toHaveAttribute(
      'href',
      '/note/adam',
    );
    expect(screen.getByRole('link', { name: 'Relu' })).toHaveAttribute(
      'data-current',
      'true',
    );
  });
});
