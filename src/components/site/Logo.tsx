import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ROUTES, SITE_NAME, SITE_SHORT } from '@/config/site';

/** Логотип перенесен из старого сайта, содержание наше. */
export function Logo({
  className,
  variant = 'compact',
}: {
  className?: string;
  variant?: 'compact' | 'full';
}) {
  return (
    <Link
      href={ROUTES.home}
      className={cn(
        'inline-flex items-center gap-3 text-ink hover:text-accent transition-colors',
        className,
      )}
      aria-label={`${SITE_NAME} - на главную`}
    >
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-white font-display text-[15px] font-semibold tracking-tight"
      >
        {SITE_SHORT}
      </span>
      <span className="hidden sm:inline font-display text-[15px] font-semibold">{SITE_NAME}</span>
    </Link>
  );
}
