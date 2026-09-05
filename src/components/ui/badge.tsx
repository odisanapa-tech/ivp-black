import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'default' | 'muted' | 'accent' | 'outline' | 'planned';

const styles: Record<Variant, string> = {
  default: 'bg-accent-soft text-accent',
  muted: 'bg-page text-muted border border-rule',
  accent: 'bg-accent text-white',
  outline: 'border border-rule text-muted',
  planned: 'border border-dashed border-rule text-muted',
};

export function Badge({
  variant = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
