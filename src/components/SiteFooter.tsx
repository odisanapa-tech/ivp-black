import Link from 'next/link';
import { CONTACTS, FOOTER_LINKS, SITE_NAME } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>{SITE_NAME}</p>
        <ul>
          {FOOTER_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <p>
          {CONTACTS.legalEntity}, ИНН {CONTACTS.inn}
          <br />
          Связаться: {CONTACTS.publicEmail}
        </p>
      </div>
    </footer>
  );
}
