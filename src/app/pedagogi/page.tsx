import type { Metadata } from 'next';
import Link from 'next/link';
import { ProfileCard } from '@/components/site/ProfileCard';
import { Button } from '@/components/ui/button';
import { Notice, Section, SectionHeader } from '@/components/ui/section';
import { EXAMPLE_PROFILES } from '@/config/profiles';
import { ROUTES } from '@/config/site';

export const metadata: Metadata = { title: 'Профили педагогов' };

/**
 * Раздел 8 ТЗ. Витрина тех, кто прошел продукты.
 * Живых профилей пока нет, поэтому все карточки помечены как примеры,
 * имена условные. Настоящих людей не выдумываем.
 */
export default function PedagogiPage() {
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
            Профили педагогов
          </div>
          <h1 className="text-display-2 font-display text-ink max-w-3xl">
            Педагоги, которые собрали свое и готовы это назвать
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl">
            Короткий профиль, по которому педагога может найти ученик или родитель: город, форматы
            работы, с кем работает и как - своими словами.
          </p>
        </div>
      </section>

      <Section className="py-12 md:py-16">
        <div className="container-tight">
          <div className="mb-10 max-w-[760px]">
            <Notice tone="demo">
              Пока в разделе только примеры заполнения. Настоящих профилей еще нет: они появятся,
              когда педагоги пройдут продукты и дадут согласие на публикацию. Имена в примерах
              условные.
            </Notice>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {EXAMPLE_PROFILES.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        </div>
      </Section>

      <Section bleed className="py-12 md:py-16">
        <div className="container-tight">
          <div className="max-w-[760px]">
            <SectionHeader
              kicker="Как сюда попасть"
              title="Профиль собирается из тетрадей"
              lead="Педагог заполняет рабочие тетради, из ответов собирается профиль, и он сам решает, что из этого видно снаружи. Наружу выносится только то, что помечено как публичное, и только после отдельного согласия."
            />
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={ROUTES.demoKabinet}>Посмотреть, как это устроено</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={ROUTES.peresborka}>Начать с пересборки</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
