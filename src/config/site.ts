/**
 * Единственное место, где живут внешний адрес сайта, адреса страниц и контакты.
 * Переезд на свой домен - замена одного значения SITE_URL (или переменной
 * окружения NEXT_PUBLIC_SITE_URL), больше нигде адрес не повторяется.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://ivp-black.vercel.app';

export const SITE_NAME = 'Институт вокальной психологии';

/** Адреса страниц. Ссылки в коде берутся отсюда, а не пишутся строкой. */
export const ROUTES = {
  home: '/',
  atlas: '/atlas',
  peresborka: '/peresborka',
  proyavlennost: '/proyavlennost',
  formats: '/formats',
  partner: '/partner',
  partnerCabinet: '/partner/kabinet',
  spasibo: '/spasibo',
  payment: '/oplata',
  privacy: '/privacy',
  oferta: '/oferta',
  requisites: '/requisites',
} as const;

/** Полный адрес страницы. Нужен для писем и партнерских ссылок. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Контакты и реквизиты.
 * ЗАГЛУШКА: значения не переданы заказчиком, показываются на страницах как есть.
 */
export const CONTACTS = {
  /** Почта, на которую уходят заявки с /proyavlennost и /formats. */
  leadsEmail: process.env.LEADS_EMAIL || '【адрес】',
  /** Публичный контакт в подвале. */
  publicEmail: '【адрес】',
  legalEntity: '【название юрлица】',
  inn: '【ИНН】',
  ogrn: '【ОГРН или ОГРНИП】',
  legalAddress: '【адрес регистрации】',
  bankDetails: '【банковские реквизиты】',
} as const;

export const HEADER_LINKS = [
  { href: ROUTES.atlas, label: 'Атлас' },
  { href: ROUTES.peresborka, label: 'Пересборка' },
  { href: ROUTES.proyavlennost, label: 'Проявленность' },
  { href: ROUTES.formats, label: 'Форматы под заказ' },
] as const;

export const FOOTER_LINKS = [
  { href: ROUTES.privacy, label: 'Политика обработки персональных данных' },
  { href: ROUTES.oferta, label: 'Оферта' },
  { href: ROUTES.requisites, label: 'Реквизиты' },
] as const;
