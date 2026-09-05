import type { Metadata } from 'next';
import { PartnerJoinForm } from '@/components/PartnerJoinForm';
import { PageHeader } from '@/components/site/PageHeader';
import { Notice, Section, SectionHeader } from '@/components/ui/section';
import { PARTNER } from '@/config/partner';
import { ROUTES } from '@/config/site';

export const metadata: Metadata = { title: 'Партнерская программа' };

const first = Math.round(PARTNER.firstPurchaseRate * 100);
const repeat = Math.round(PARTNER.repeatPurchaseRate * 100);

/** Публичная часть партнерской программы. */
export default async function PartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ login?: string }>;
}) {
  const { login } = await searchParams;

  return (
    <>
      <PageHeader
        kicker="Партнерам"
        title="Партнерская программа"
        lead="Если вы рекомендуете наши материалы коллегам или своим ученикам, мы делимся с вами частью того, что они принесли."
      />

      <div className="container-prose pb-16 md:pb-20">
        {login === 'expired' && (
          <div className="mb-10">
            <Notice tone="demo">
              Ссылка для входа больше не работает: у нее истек срок. Оставьте почту ниже, придет
              новая.
            </Notice>
          </div>
        )}

        <div className="prose-ivp">
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-4">Сколько</h2>
          <ul>
            <li>
              <strong>{first} процентов</strong> с первой покупки человека, который пришел по вашей
              ссылке.
            </li>
            <li>
              <strong>{repeat} процентов</strong> со всех его следующих покупок, пожизненно.
            </li>
          </ul>
          <p>База расчета - фактически поступившая сумма, после скидок, если они были.</p>

          <h2 className="font-display text-[24px] md:text-[28px] text-ink mt-10 mb-4">
            Как закрепляется человек
          </h2>
          <p>
            Первый партнер, по ссылке которого пришел человек, закреплен за ним навсегда. Если
            позже он перейдет по ссылке другого партнера, закрепление не изменится. Это правило
            работает в обе стороны: чужого ученика у вас не заберут, но и чужого вы не получите.
          </p>
          <p>
            Код из ссылки хранится в браузере человека {PARTNER.cookieDays} дней. Закрепление
            происходит в момент первой покупки.
          </p>

          <h2 className="font-display text-[24px] md:text-[28px] text-ink mt-10 mb-4">
            Когда выплата
          </h2>
          <p>
            Вознаграждение появляется в кабинете сразу после оплаты, в статусе «ожидает
            подтверждения». В статус «к выплате» оно переходит после того, как продукт завершен: так
            мы не выплачиваем вознаграждение с покупки, по которой может быть возврат.
          </p>

          <h2 className="font-display text-[24px] md:text-[28px] text-ink mt-10 mb-4">
            Кто может подключиться
          </h2>
          <p>
            Любой человек, который знаком с нашими материалами: вокальный педагог, руководитель
            студии, коллега из смежной области. Ограничений по числу учеников нет.
          </p>

          <h2 className="font-display text-[24px] md:text-[28px] text-ink mt-10 mb-4">Налоги</h2>
          <p>
            Выплаты идут только тем, кто может принять их легально: самозанятым или ИП. Налоги
            партнер платит сам. 【порядок оформления: договор, акт, чек - уточняет заказчик】
          </p>
        </div>
      </div>

      <Section bleed className="py-12 md:py-16">
        <div className="container-prose">
          <SectionHeader
            title="Подключиться"
            lead="Оставьте почту, и мы пришлем на нее партнерский код и ссылку для входа в кабинет. Пароля нет: вход всегда по ссылке из письма."
          />
          <PartnerJoinForm />
          <p className="mt-8 text-[15px] text-muted leading-relaxed">
            Уже подключены? Ссылка для входа приходит на почту. Если она перестала работать,
            оставьте почту еще раз - придет новая. Кабинет находится по адресу{' '}
            {ROUTES.partnerCabinet}.
          </p>
        </div>
      </Section>
    </>
  );
}
