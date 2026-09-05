import type { Metadata } from 'next';
import { CabinetDemo } from '@/components/demo/CabinetDemo';
import { Notice } from '@/components/ui/section';

export const metadata: Metadata = { title: 'Демонстрация кабинета педагога' };

/**
 * Раздел 9 ТЗ. Это не первая очередь и не вторая, это демонстрация:
 * посмотреть, как выглядит идея, а не запускать ее.
 */
export default function DemoKabinetPage() {
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
        <div className="container-tight pt-14 md:pt-20 pb-8 md:pb-10">
          <div className="kicker mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
            Демонстрация
          </div>
          <h1 className="text-display-2 font-display text-ink max-w-3xl">Кабинет педагога</h1>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl">
            Тетради заполняются на сайте, ответы копятся, и из них собирается профиль. Но только из
            того, что вы сами решили показать.
          </p>
        </div>
      </section>

      <div className="container-tight pb-8">
        <Notice tone="demo">
          <strong>Демонстрация.</strong> Данные не сохраняются между сессиями и никуда не
          передаются: все написанное живет только в вашем браузере и пропадет, когда вы закроете
          вкладку.
        </Notice>
      </div>

      <div className="container-tight pb-20 md:pb-28">
        <CabinetDemo />
      </div>
    </>
  );
}
