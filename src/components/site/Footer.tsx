import Link from 'next/link';
import { Logo } from './Logo';
import { CONTACTS, FOOTER_LINKS, PRODUCTS_ANCHOR, ROUTES, SITE_NAME } from '@/config/site';

/**
 * Подвал перенесен из старого сайта: сетка колонок, разделитель, нижняя строка.
 * Содержание наше, блока про лицензию нет.
 */
const columns = [
  {
    title: 'Продукты',
    links: [
      { href: PRODUCTS_ANCHOR, label: 'Все продукты' },
      { href: ROUTES.atlas, label: 'Педагогический атлас' },
      { href: ROUTES.peresborka, label: 'Профессиональная пересборка' },
      { href: ROUTES.formats, label: 'Форматы под заказ' },
    ],
  },
  {
    title: 'Институт',
    links: [
      { href: ROUTES.pedagogi, label: 'Профили педагогов' },
      { href: ROUTES.partner, label: 'Партнерская программа' },
    ],
  },
  {
    title: 'Информация',
    links: FOOTER_LINKS,
  },
];

export function SiteFooter() {
  return (
    <footer className="rule bg-card mt-auto">
      <div className="container-tight py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-5 text-sm text-muted leading-relaxed max-w-[260px]">
              Совместный проект Марии Осадчей и Дмитрия Осадчего. Материалы для вокального
              педагога.
            </p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-[13px] uppercase tracking-[0.14em] text-muted mb-4">
                {c.title}
              </h4>
              <ul className="space-y-2.5 text-[14px]">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ink/80 hover:text-accent transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-rule/70 flex flex-col md:flex-row md:items-center gap-4 md:justify-between text-[13px] text-muted">
          <div>
            {new Date().getFullYear()}, {SITE_NAME}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center">
            <span>{CONTACTS.publicEmail}</span>
            <span className="hidden md:inline">·</span>
            <span>
              {CONTACTS.legalEntity}, ИНН {CONTACTS.inn}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
