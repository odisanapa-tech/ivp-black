import type { Metadata } from 'next';
import { LeadForm } from '@/components/LeadForm';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Section, SectionHeader } from '@/components/ui/section';

export const metadata: Metadata = { title: 'Форматы под заказ' };

/**
 * Раздел 7.8 ТЗ. Заказчик обычно не педагог лично, а школа, академия или
 * организатор, поэтому здесь заявка, а не оплата, и цены не публикуются.
 */
const FORMATS: { title: string; author: 'Мария' | 'Дмитрий' }[] = [
  { title: 'Девять мастер-классов и практикумов для педагогов', author: 'Мария' },
  { title: '«Наставник, а не спасатель»', author: 'Мария' },
  { title: 'Практикум по запросу на изменение состояния ученика', author: 'Мария' },
  { title: '«Атлас музыкальных профессий будущего»', author: 'Дмитрий' },
  { title: '«Энергохакинг артиста»', author: 'Дмитрий' },
  { title: 'Программа профилактики выгорания для школы искусств', author: 'Дмитрий' },
];

export default function FormatsPage() {
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
        <div className="container-tight pt-14 md:pt-20 pb-10 md:pb-14">
          <div className="kicker mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
            Мария и Дмитрий
          </div>
          <h1 className="text-display-2 font-display text-ink max-w-3xl">Форматы под заказ</h1>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl">
            Живые встречи для школы, студии или своего коллектива. Разбор под задачу, а не готовый
            продукт с полки.
          </p>
        </div>
      </section>

      <Section className="py-12 md:py-16">
        <div className="container-tight">
          <SectionHeader title="Что можно заказать" />
          <div className="grid gap-4 md:grid-cols-2">
            {FORMATS.map((f) => (
              <Card key={f.title} className="bg-page">
                <div className="p-6 flex items-start justify-between gap-4">
                  <h3 className="font-display text-[18px] font-medium text-ink leading-snug">
                    {f.title}
                  </h3>
                  <Badge variant="outline">{f.author}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section bleed className="py-12 md:py-16">
        <div className="container-tight">
          <div className="max-w-[760px]">
            <SectionHeader
              kicker="Школам и студиям"
              title="Работа с командой устроена иначе"
              lead="Разбирается не отдельный человек, а то, как в школе устроены роли, форматы и передача работы между педагогами. Программа собирается под вашу задачу, поэтому цены не публикуются: они зависят от объема и формата."
            />
            <LeadForm productId="formats" cta="Оставить заявку" />
          </div>
        </div>
      </Section>
    </>
  );
}
