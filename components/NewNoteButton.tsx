import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

export function NewNoteButton() {
  return (
    <Link
      href="/column/new"
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'sm',
          className:
            'w-full gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground active:scale-95',
        }),
      )}
    >
      <Plus />
      New note
    </Link>
  );
}
