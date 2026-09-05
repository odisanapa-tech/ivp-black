import type { MetadataRoute } from 'next';

/** Индексация закрыта целиком, до отдельной команды заказчика. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
