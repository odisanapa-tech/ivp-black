import Link from 'next/link';
import { HEADER_LINKS, ROUTES } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href={ROUTES.home} className="logo">
          ИВП
        </Link>
        <nav>
          {HEADER_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href={ROUTES.partner}>Партнерам</Link>
        </nav>
      </div>
    </header>
  );
}
