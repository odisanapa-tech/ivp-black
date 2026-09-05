import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';

/**
 * Шаблон страницы продукта.
 * Порядок блоков: ситуация, что внутри, что на выходе, цена и кнопка,
 * один переход дальше.
 *
 * Чего в шаблоне нет и не появится: отзывов, блоков "почему мы", сравнения
 * с конкурентами, длинных биографий.
 */
export type ProductSection = { title?: string; body: ReactNode };

export function ProductLayout({
  kicker,
  h1,
  authorNote,
  sections,
  buy,
  aside,
  next,
}: {
  kicker: string;
  h1: string;
  authorNote?: ReactNode;
  sections: ProductSection[];
  buy: ReactNode;
  /** Дополнительный блок перед переходом дальше: связка с другим продуктом. */
  aside?: ReactNode;
  next: { text: string; href: string; label: string };
}) {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              'radial-gradient(60% 55% at 78% 18%, #EDE4F0 0%, transparent 60%), radial-gradient(50% 45% at 8% 90%, #F1E7D8 0%, transparent 55%)',
          }}
        />
        <div className="container-prose pt-14 md:pt-20 pb-10 md:pb-14">
          <div className="kicker mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
            {kicker}
          </div>
          <h1 className="text-display-2 font-display text-ink">{h1}</h1>
          {authorNote && <p className="mt-5 text-[16px] text-muted leading-relaxed">{authorNote}</p>}
        </div>
      </section>

      <div className="container-prose pb-4">
        <article className="prose-ivp">
          {sections.map((s, i) => (
            <section key={i} className="mb-10">
              {s.title && (
                <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-4">{s.title}</h2>
              )}
              {s.body}
            </section>
          ))}
        </article>
      </div>

      <Section bleed className="py-12 md:py-16">
        <div className="container-prose">{buy}</div>
      </Section>

      {aside && (
        <div className="container-prose pt-12 md:pt-16">{aside}</div>
      )}

      {/* Один переход дальше, не список. */}
      <Section className="py-12 md:py-16">
        <div className="container-prose">
          <div className="rounded-lg border border-rule bg-card p-6 md:p-8">
            <p className="text-[17px] text-ink/90 leading-relaxed mb-6">{next.text}</p>
            <Button asChild>
              <Link href={next.href}>
                {next.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
