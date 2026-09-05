import { ROUTES } from './site';

/**
 * Витрина. Идентификатор продукта строковый и постоянный: он уходит в orders,
 * accruals и партнерские ссылки, менять его после первой продажи нельзя.
 *
 * Цены заказчиком не названы. price = null означает видимый плейсхолдер
 * 【цена】, а не выдуманное число.
 */

export type ProductKind = 'file' | 'lead';
/**
 * Как показывается цена. Не выводится из ProductKind: у курса действие -
 * заявка на поток, а цена при этом у него есть.
 */
export type PriceMode = 'price' | 'onRequest';
export type Author = 'Мария' | 'Дмитрий' | 'Совместно' | 'Мария и Дмитрий';

export type Product = {
  id: string;
  title: string;
  /** Ровно одна строка о сути, текст из раздела 7.1 ТЗ. */
  summary: string;
  author: Author;
  price: number | null;
  priceMode: PriceMode;
  kind: ProductKind;
  href: string;
};

export const PRICE_PLACEHOLDER = '【цена】';

export const PRODUCTS: Product[] = [
  {
    id: 'atlas',
    title: 'Педагогический атлас',
    summary: 'Из чего состоит работа вокального педагога: шесть форматов по восьми осям',
    author: 'Мария',
    price: null,
    priceMode: 'price',
    kind: 'file',
    href: ROUTES.atlas,
  },
  {
    id: 'peresborka-base',
    title: 'Профессиональная пересборка',
    summary: 'Собрать из своего опыта метод и то, что из него можно продавать',
    author: 'Дмитрий',
    price: null,
    priceMode: 'price',
    kind: 'file',
    href: ROUTES.peresborka,
  },
  {
    id: 'peresborka-razbor',
    title: 'Профессиональная пересборка, с разбором',
    summary: 'Те же тетради плюс встреча и карта рынка вашего города',
    author: 'Дмитрий',
    price: null,
    priceMode: 'price',
    kind: 'file',
    href: ROUTES.peresborka,
  },
  {
    id: 'golos-snaruzhi',
    title: 'Ваш голос снаружи',
    summary: 'Начать говорить о себе так, чтобы вас узнавали. Без встреч, за несколько дней',
    author: 'Мария',
    price: null,
    priceMode: 'price',
    kind: 'file',
    href: ROUTES.golosSnaruzhi,
  },
  {
    id: 'obnovlenie',
    title: 'Профессиональное обновление',
    summary: 'Курс из трех модулей: границы, роли, своя уникальность',
    author: 'Мария',
    price: null,
    priceMode: 'price',
    kind: 'lead',
    href: ROUTES.obnovlenie,
  },
  {
    id: 'proyavlennost',
    title: 'Страница и тексты',
    summary: 'Вынести собранное наружу: страница, о которой не стыдно сказать',
    author: 'Совместно',
    price: null,
    priceMode: 'onRequest',
    kind: 'lead',
    href: ROUTES.proyavlennost,
  },
  {
    id: 'formats',
    title: 'Форматы под заказ',
    summary: 'Живые встречи для школы, студии или своего коллектива',
    author: 'Мария и Дмитрий',
    price: null,
    priceMode: 'onRequest',
    kind: 'lead',
    href: ROUTES.formats,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * Лестница на главной: шесть карточек в порядке из раздела 7.1 ТЗ.
 * Дорогой вариант пересборки отдельной карточкой не выносится, он живет
 * на своей странице.
 */
export const LADDER_IDS = [
  'atlas',
  'peresborka-base',
  'golos-snaruzhi',
  'obnovlenie',
  'proyavlennost',
  'formats',
] as const;

/** Цена для показа. Пока цены нет - видимый плейсхолдер. */
export function formatPrice(price: number | null): string {
  if (price === null) return PRICE_PLACEHOLDER;
  return `${(price / 100).toLocaleString('ru-RU')} руб.`;
}

/** Что написано в карточке: цена или "по заявке". */
export function priceLabel(p: Product): string {
  return p.priceMode === 'onRequest' ? 'по заявке' : formatPrice(p.price);
}
