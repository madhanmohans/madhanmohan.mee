import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { NewNoteButton } from '@/components/NewNoteButton';

export default function Layout({ children }: LayoutProps<'/column'>) {
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={IS_DEVELOPMENT ? { banner: <NewNoteButton /> } : undefined}
    >
      {children}
    </DocsLayout>
  );
}
