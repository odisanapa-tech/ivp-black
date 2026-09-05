import type { Metadata } from 'next';
import Link from 'next/link';
import { CopyBox } from '@/components/CopyBox';
import { PageHeader } from '@/components/site/PageHeader';
import { Notice } from '@/components/ui/section';
import { cn } from '@/lib/cn';
import { PARTNER } from '@/config/partner';
import { PRODUCTS } from '@/config/products';
import { absoluteUrl, ROUTES } from '@/config/site';
import {
  ACCRUAL_STATUS_LABEL,
  currentPartner,
  partnerAccruals,
  partnerPayouts,
  partnerStudents,
  partnerVisits,
  rubles,
} from '@/lib/partner';

export const metadata: Metadata = { title: 'Партнерский кабинет' };
export const dynamic = 'force-dynamic';

const SCREENS = [
  { key: 'link', label: 'Ссылка' },
  { key: 'materials', label: 'Материалы' },
  { key: 'visits', label: 'Переходы' },
  { key: 'accruals', label: 'Начисления' },
  { key: 'students', label: 'Мои ученики' },
  { key: 'payouts', label: 'Выплаты' },
] as const;

type ScreenKey = (typeof SCREENS)[number]['key'];

function refLink(path: string, code: string): string {
  return absoluteUrl(`${path}?${PARTNER.queryParam}=${code}`);
}

export default async function CabinetPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const partner = await currentPartner();

  if (!partner) {
    return (
      <>
        <PageHeader kicker="Партнерам" title="Вход в кабинет" />
        <div className="container-prose pb-20 md:pb-28">
          <p className="text-[17px] text-ink/90 leading-relaxed">
            Кабинет открывается по ссылке из письма. Пароля нет. Если ссылка перестала работать,
            оставьте почту на{' '}
            <Link href={ROUTES.partner} className="link-underline">
              странице программы
            </Link>
            , и придет новая.
          </p>
        </div>
      </>
    );
  }

  const { e } = await searchParams;
  const screen: ScreenKey = (SCREENS.find((s) => s.key === e)?.key ?? 'link') as ScreenKey;

  const [visits, accruals, students, payouts] = await Promise.all([
    screen === 'visits' ? partnerVisits(partner.id) : Promise.resolve([]),
    screen === 'accruals' ? partnerAccruals(partner.id) : Promise.resolve([]),
    screen === 'students' ? partnerStudents(partner.id) : Promise.resolve([]),
    screen === 'payouts' ? partnerPayouts(partner.id) : Promise.resolve([]),
  ]);

  const sellable = PRODUCTS.filter((p) => p.id !== 'peresborka-razbor');

  return (
    <>
      <PageHeader
        kicker="Партнерам"
        title="Партнерский кабинет"
        lead={`${partner.name ?? partner.email}, код ${partner.code}${
          partner.status !== 'active' ? ' - заявка на подтверждении' : ''
        }`}
        wide
      />
      <div className="container-tight pb-20 md:pb-28">
      {partner.status !== 'active' && (
        <div className="mb-8">
          <Notice tone="demo">
            Пока заявка не подтверждена, переходы по вашей ссылке не засчитываются и вознаграждение
            не начисляется.
          </Notice>
        </div>
      )}

      <nav className="flex flex-wrap gap-2 mb-10">
        {SCREENS.map((s) => (
          <Link
            key={s.key}
            href={`${ROUTES.partnerCabinet}?e=${s.key}`}
            className={cn(
              'rounded-md px-4 py-2.5 text-[15px] transition-colors border',
              s.key === screen
                ? 'bg-accent text-white border-accent'
                : 'bg-page text-ink border-rule hover:border-accent hover:text-accent',
            )}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      {screen === 'link' && (
        <section>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-4">Ваша ссылка</h2>
          <p>Общая ссылка на сайт:</p>
          <CopyBox value={refLink(ROUTES.home, partner.code)} />
          <p>Отдельная ссылка на каждый продукт:</p>
          {sellable.map((p) => (
            <div key={p.id}>
              <p className="text-[15px] text-muted" style={{ marginBottom: 6 }}>{p.title}</p>
              <CopyBox value={refLink(p.href, partner.code)} />
            </div>
          ))}
        </section>
      )}

      {screen === 'materials' && (
        <section>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-4">Готовые тексты</h2>
          <p>
            Можно брать как есть или править под свой голос. Ссылка внутри уже с вашим кодом.
          </p>

          <h3 className="font-display text-[19px] text-ink mt-8 mb-3">Письмо ученикам: атлас</h3>
          <CopyBox
            multiline
            value={`Здравствуйте!\n\nПопался материал, который мне самой пригодился, и я подумала о вас.\n\nЭто разбор шести форматов работы вокального педагога: кто в каждом заказчик, с каким запросом приходят, какая у вас роль и где ваши границы. Читать подряд не нужно, это скорее навигатор.\n\nПосмотреть: ${refLink(ROUTES.atlas, partner.code)}`}
          />

          <h3 className="font-display text-[19px] text-ink mt-8 mb-3">Пост в канал: атлас</h3>
          <CopyBox
            multiline
            value={`Подготовить ребенка к конкурсу и провести вокальную медитацию для взрослого - это разные виды работы. А называем мы это одинаково: уроки вокала.\n\nВ «Педагогическом атласе» шесть форматов разобраны по восьми осям: кто заказчик, с каким запросом приходят, какая у педагога роль, где границы. И к каждому формату - как объяснить свою ценность тому, кто платит.\n\n${refLink(ROUTES.atlas, partner.code)}`}
          />

          <h3 className="font-display text-[19px] text-ink mt-8 mb-3">Письмо ученикам: пересборка</h3>
          <CopyBox
            multiline
            value={`Здравствуйте!\n\nЕсли у вас накопился опыт, а собрать его во что-то свое не выходит - посмотрите «Профессиональную пересборку». Это две рабочие тетради, из которых вынимается ваш метод и то, что из него можно предлагать людям.\n\n${refLink(ROUTES.peresborka, partner.code)}`}
          />

          <h3 className="font-display text-[19px] text-ink mt-8 mb-3">
            Письмо ученикам: голос снаружи
          </h3>
          <CopyBox
            multiline
            value={`Здравствуйте!\n\nЕсли вам давно хочется рассказывать о себе, а каждый пост приходится начинать с нуля - посмотрите «Ваш голос снаружи». Это рабочая тетрадь на несколько дней, без встреч и созвонов. Заканчивается не планом, а опубликованным постом.\n\n${refLink(ROUTES.golosSnaruzhi, partner.code)}`}
          />
        </section>
      )}

      {screen === 'visits' && (
        <section>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-4">Переходы</h2>
          {visits.length === 0 ? (
            <p className="text-[15px] text-muted">Переходов пока нет.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[15px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">День</th>
                    <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Переходов</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v) => (
                    <tr key={v.day}>
                      <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{v.day}</td>
                      <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{v.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {screen === 'accruals' && (
        <section>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-4">Начисления</h2>
          {accruals.length === 0 ? (
            <p className="text-[15px] text-muted">Начислений пока нет.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[15px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Продукт</th>
                    <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Дата</th>
                    <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Ставка</th>
                    <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Сумма</th>
                    <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {accruals.map((a, i) => (
                    <tr key={i}>
                      <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{a.title}</td>
                      <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{new Date(a.created_at).toLocaleDateString('ru-RU')}</td>
                      <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{Math.round(Number(a.rate) * 100)} процентов</td>
                      <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{rubles(a.amount)}</td>
                      <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{ACCRUAL_STATUS_LABEL[a.status] ?? a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {screen === 'students' && (
        <section>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-4">Мои ученики</h2>
          <p className="text-[15px] text-muted">
            Закрепленные за вами навсегда. Больше о них здесь ничего не показывается.
          </p>
          {students.length === 0 ? (
            <p className="text-[15px] text-muted">Пока никого.</p>
          ) : (
            <table className="w-full text-[15px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Имя</th>
                  <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Закреплен</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i}>
                    <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{s.name ?? 'Без имени'}</td>
                    <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{new Date(s.first_seen_at).toLocaleDateString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {screen === 'payouts' && (
        <section>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-4">Выплаты</h2>
          {payouts.length === 0 ? (
            <p className="text-[15px] text-muted">Выплат пока не было.</p>
          ) : (
            <table className="w-full text-[15px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Дата</th>
                  <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Продукт</th>
                  <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p, i) => (
                  <tr key={i}>
                    <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('ru-RU') : '-'}</td>
                    <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{p.title}</td>
                    <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{rubles(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 className="font-display text-[19px] text-ink mt-8 mb-3">Реквизиты и налоговый статус</h3>
          <table className="w-full text-[15px] border-collapse">
            <tbody>
              <tr>
                <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Налоговый статус</th>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{partner.tax_status ?? 'не указан'}</td>
              </tr>
              <tr>
                <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Реквизиты для перевода</th>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{partner.payout_details ?? 'не указаны'}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[15px] text-muted mt-4">
            Изменить реквизиты пока можно только письмом: 【порядок изменения реквизитов】
          </p>
        </section>
      )}
      </div>
    </>
  );
}
