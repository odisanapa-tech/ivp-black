import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Filter } from '@/components/Filter';
import { Hero } from '@/components/site/Hero';
import { ProductCard } from '@/components/site/ProductCard';
import { ProfileCard } from '@/components/site/ProfileCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section, SectionHeader } from '@/components/ui/section';
import { EXAMPLE_PROFILES } from '@/config/profiles';
import { LADDER_IDS, getProduct } from '@/config/products';
import { FILTER_ANCHOR, PRODUCTS_ANCHOR, ROUTES } from '@/config/site';

/**
 * Главная. Порядок блоков из раздела 6 ТЗ: первый экран, лестница продуктов,
 * фильтр, кто ведет, профили педагогов, форматы под заказ.
 *
 * Лестница стоит до фильтра: человек, который не хочет проходить опрос,
 * должен видеть, что тут продается, не прокручивая два экрана.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        kicker="Институт вокальной психологии"
        title="Устаешь не от количества уроков, а от ощущения, что делаешь что-то не то"
        lead="Материалы для вокального педагога: разобраться, из чего на самом деле состоит ваша работа, собрать из своего опыта то, что можно предъявить, и научиться объяснять свою ценность тому, кто платит."
        primary={{ href: PRODUCTS_ANCHOR, label: 'Посмотреть продукты' }}
        secondary={{ href: FILTER_ANCHOR, label: 'Подобрать за два вопроса' }}
      />

      {/* Лестница продуктов. Шесть карточек, порядок из раздела 7.1 ТЗ. */}
      <Section id="products" className="scroll-mt-20">
        <div className="container-tight">
          <SectionHeader
            kicker="Витрина"
            title="Что у нас есть"
            lead="Шесть продуктов. У каждого свой автор: Мария работает с тем, кто поет, Дмитрий - с тем, кто учит петь."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {LADDER_IDS.map((id) => {
              const product = getProduct(id);
              return product ? <ProductCard key={product.id} product={product} /> : null;
            })}
          </div>
        </div>
      </Section>

      {/* Фильтр встроен прямо в страницу, отдельного адреса нет. */}
      <Section id="filtr" bleed className="scroll-mt-20">
        <div className="container-tight">
          <div className="max-w-[760px]">
            <SectionHeader
              kicker="Два вопроса"
              title="Что вам подойдет"
              lead="В конце - один продукт, а не список из шести."
            />
            <Filter />
          </div>
        </div>
      </Section>

      {/* Кто ведет. Текст из раздела 7.7 ТЗ. */}
      <Section>
        <div className="container-tight">
          <SectionHeader kicker="Кто ведет" title="Два человека, два предмета" />
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="bg-page">
              <div className="p-6 md:p-7">
                <h3 className="font-display text-[21px] font-medium text-ink mb-3">
                  Мария Осадчая
                </h3>
                <p className="text-[16px] text-ink/90 leading-relaxed">
                  Вокальный психолог, практикующий психолог, наставник Музыкальной академии Ларисы
                  Долиной. Двадцать лет работала вокальным педагогом. Работает с тем, кто поет: с
                  состоянием, со сценой, с голосом как отражением личности.
                </p>
              </div>
            </Card>
            <Card className="bg-page">
              <div className="p-6 md:p-7">
                <h3 className="font-display text-[21px] font-medium text-ink mb-3">
                  Дмитрий Осадчий
                </h3>
                <p className="text-[16px] text-ink/90 leading-relaxed">
                  Психолог, магистр психологии, специализация - психология профессионального
                  развития. Работает с тем, кто учит петь: с профессиональной идентичностью,
                  методом и тем, как собрать из практики то, что можно предъявить.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Профили педагогов: две-три карточки и ссылка в раздел. */}
      <Section bleed>
        <div className="container-tight">
          <SectionHeader
            kicker="Профили педагогов"
            title="Витрина тех, кто прошел продукты"
            lead="Короткий профиль, по которому педагога может найти ученик или родитель."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {EXAMPLE_PROFILES.slice(0, 3).map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href={ROUTES.pedagogi}
              className="inline-flex items-center gap-1.5 text-[15px] text-accent hover:text-accent-hover font-medium"
            >
              Все профили
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Плашка "Форматы под заказ". */}
      <Section>
        <div className="container-tight">
          <div className="rounded-lg border border-rule bg-card p-7 md:p-10">
            <div className="kicker mb-4">Школам и студиям</div>
            <h2 className="font-display text-display-3 text-ink mb-4">Форматы под заказ</h2>
            <p className="text-[17px] text-muted leading-relaxed max-w-2xl mb-7">
              Живые встречи для школы, студии или своего коллектива. Разбор под вашу задачу, а не
              готовый продукт с полки. Здесь начинается разговор, а не покупка.
            </p>
            <Button asChild size="lg">
              <Link href={ROUTES.formats}>Посмотреть форматы</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
