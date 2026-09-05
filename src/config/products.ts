import { ROUTES } from './site';

/**
 * Витрина. Идентификатор продукта строковый и постоянный: он уходит в orders,
 * accruals и партнерские ссылки, менять его после первой продажи нельзя.
 *
 * Цены заказчиком не переданы. price = null означает, что на странице
 * показывается видимый плейсхолдер 【цена】, а не выдуманное число.
 */

export type ProductKind = 'file' | 'lead';

export type Product = {
  id: string;
  title: string;
  /** Строка под заголовком в лестнице продуктов на главной. */
  summary: string;
  /** Цена в копейках или null, если не назначена. */
  price: number | null;
  kind: ProductKind;
  href: string;
};

export const PRICE_PLACEHOLDER = '【цена】';

export const PRODUCTS: Product[] = [
  {
    id: 'atlas',
    title: 'Педагогический атлас',
    summary: 'Навигатор по форматам работы вокального педагога. Шесть форматов, восемь осей.',
    price: null,
    kind: 'file',
    href: ROUTES.atlas,
  },
  {
    id: 'peresborka-base',
    title: 'Профессиональная пересборка',
    summary: 'Две рабочие тетради. Из заполненного вынимается ваш метод и то, что можно продавать.',
    price: null,
    kind: 'file',
    href: ROUTES.peresborka,
  },
  {
    id: 'peresborka-razbor',
    title: 'Профессиональная пересборка, с разбором',
    summary: 'Тетради, личная встреча с разбором и карта рынка вашего города.',
    price: null,
    kind: 'file',
    href: ROUTES.peresborka,
  },
  {
    id: 'proyavlennost',
    title: 'Профессиональная проявленность',
    summary: 'Собранное выносится наружу: страница и тексты, в которых вас можно узнать.',
    price: null,
    kind: 'lead',
    href: ROUTES.proyavlennost,
  },
  {
    id: 'formats',
    title: 'Форматы под заказ',
    summary: 'Работа со студией и командой: разбор под задачу, а не готовый продукт с полки.',
    price: null,
    kind: 'lead',
    href: ROUTES.formats,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Четыре карточки лестницы продуктов на главной, строго в порядке из ТЗ. */
export const LADDER_IDS = ['atlas', 'peresborka-base', 'proyavlennost', 'formats'] as const;

/** Цена для показа. Пока цены нет - видимый плейсхолдер. */
export function formatPrice(price: number | null): string {
  if (price === null) return PRICE_PLACEHOLDER;
  return `${(price / 100).toLocaleString('ru-RU')} руб.`;
}
