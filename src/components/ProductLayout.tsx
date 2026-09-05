import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Шаблон страницы продукта (раздел 7.2 ТЗ).
 * Порядок блоков: ситуация, что внутри, что на выходе, тиры и цена, кнопка,
 * один переход дальше.
 *
 * Чего в шаблоне нет и не появится: отзывов, блоков "почему мы", сравнения
 * с конкурентами, длинных биографий.
 */
export type ProductSection = { title?: string; body: ReactNode };

export function ProductLayout({
  h1,
  sections,
  buy,
  next,
}: {
  h1: string;
  sections: ProductSection[];
  buy: ReactNode;
  next: { text: string; href: string; label: string };
}) {
  return (
    <article>
      <h1>{h1}</h1>

      {sections.map((s, i) => (
        <section key={i}>
          {s.title && <h2>{s.title}</h2>}
          {s.body}
        </section>
      ))}

      <section>{buy}</section>

      {/* Один переход дальше, не список. */}
      <section>
        <div className="card">
          <p>{next.text}</p>
          <Link className="cta" href={next.href}>
            {next.label}
          </Link>
        </div>
      </section>
    </article>
  );
}
