import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

const VARIANT_CLASSES = {
  primary: 'gap-2 [&_svg]:size-3.5 active:scale-95',
  secondary:
    'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground active:scale-95',
  destructive: 'gap-1 [&_svg]:size-3 text-red-500 active:scale-95',
  plain: 'active:scale-95',
};

// Small toolbar button shared by the note editors
export function ActionButton({
  variant = 'secondary',
  className,
  ...buttonProps
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANT_CLASSES;
}) {
  return (
    <button
      className={cn(
        buttonVariants({
          color: variant === 'primary' ? 'primary' : 'secondary',
          size: 'sm',
          className: cn(VARIANT_CLASSES[variant], className),
        }),
      )}
      {...buttonProps}
    />
  );
}
