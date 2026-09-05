/**
 * Единственное место, где живут внешний адрес сайта, адреса страниц и контакты.
 * Переезд на свой домен - замена одного значения SITE_URL.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://ivp-black.vercel.app';

export const SITE_NAME = 'Институт вокальной психологии';
export const SITE_SHORT = 'ИВП';

export const ROUTES = {
  home: '/',
  atlas: '/atlas',
  peresborka: '/peresborka',
  golosSnaruzhi: '/golos-snaruzhi',
  obnovlenie: '/obnovlenie',
  proyavlennost: '/proyavlennost',
  formats: '/formats',
  pedagogi: '/pedagogi',
  demoKabinet: '/demo/kabinet',
  partner: '/partner',
  partnerCabinet: '/partner/kabinet',
  spasibo: '/spasibo',
  payment: '/oplata',
  privacy: '/privacy',
  oferta: '/oferta',
  requisites: '/requisites',
} as const;

/** Якорь лестницы продуктов на главной. Пункт меню "Продукты" ведет сюда. */
export const PRODUCTS_ANCHOR = '/#products';
export const FILTER_ANCHOR = '/#filtr';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Контакты и реквизиты.
 * ЗАГЛУШКА: значения не переданы заказчиком, показываются на страницах как есть.
 */
export const CONTACTS = {
  leadsEmail: process.env.LEADS_EMAIL || '【адрес】',
  publicEmail: '【адрес】',
  legalEntity: '【название юрлица】',
  inn: '【ИНН】',
  ogrn: '【ОГРН или ОГРНИП】',
  legalAddress: '【адрес регистрации】',
  bankDetails: '【банковские реквизиты】',
} as const;

/**
 * Шапка: три пункта, без рабочего жаргона.
 * Внутренние названия "пересборка" и "проявленность" в меню не выносятся.
 */
export const HEADER_LINKS = [
  { href: PRODUCTS_ANCHOR, label: 'Продукты' },
  { href: ROUTES.pedagogi, label: 'Профили педагогов' },
  { href: ROUTES.partner, label: 'Партнерам' },
] as const;

export const FOOTER_LINKS = [
  { href: ROUTES.privacy, label: 'Политика обработки персональных данных' },
  { href: ROUTES.oferta, label: 'Оферта' },
  { href: ROUTES.requisites, label: 'Реквизиты' },
] as const;
