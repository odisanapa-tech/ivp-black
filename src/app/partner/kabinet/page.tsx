import type { Metadata } from 'next';
import Link from 'next/link';
import { CopyBox } from '@/components/CopyBox';
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
      <article>
        <h1>Вход в кабинет</h1>
        <p>
          Кабинет открывается по ссылке из письма. Пароля нет. Если ссылка перестала работать,
          оставьте почту на <Link href={ROUTES.partner}>странице программы</Link>, и придет новая.
        </p>
      </article>
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
    <article>
      <h1>Партнерский кабинет</h1>
      <p className="muted">
        {partner.name ?? partner.email}, код {partner.code}
        {partner.status !== 'active' && ' - заявка на подтверждении'}
      </p>

      {partner.status !== 'active' && (
        <div className="dev-note">
          Пока заявка не подтверждена, переходы по вашей ссылке не засчитываются и вознаграждение
          не начисляется.
        </div>
      )}

      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '24px 0 32px' }}>
        {SCREENS.map((s) => (
          <Link
            key={s.key}
            href={`${ROUTES.partnerCabinet}?e=${s.key}`}
            className={s.key === screen ? 'cta' : 'cta-secondary'}
            style={{ padding: '10px 18px', fontSize: 17 }}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      {screen === 'link' && (
        <section>
          <h2>Ваша ссылка</h2>
          <p>Общая ссылка на сайт:</p>
          <CopyBox value={refLink(ROUTES.home, partner.code)} />
          <p>Отдельная ссылка на каждый продукт:</p>
          {sellable.map((p) => (
            <div key={p.id}>
              <p className="muted" style={{ marginBottom: 6 }}>{p.title}</p>
              <CopyBox value={refLink(p.href, partner.code)} />
            </div>
          ))}
        </section>
      )}

      {screen === 'materials' && (
        <section>
          <h2>Готовые тексты</h2>
          <p>
            Можно брать как есть или править под свой голос. Ссылка внутри уже с вашим кодом.
          </p>

          <h3>Письмо ученикам: атлас</h3>
          <CopyBox
            multiline
            value={`Здравствуйте!\n\nПопался материал, который мне самой пригодился, и я подумала о вас.\n\nЭто разбор шести форматов работы вокального педагога: кто в каждом заказчик, с каким запросом приходят, какая у вас роль и где ваши границы. Читать подряд не нужно, это скорее навигатор.\n\nПосмотреть: ${refLink(ROUTES.atlas, partner.code)}`}
          />

          <h3>Пост в канал: атлас</h3>
          <CopyBox
            multiline
            value={`Подготовить ребенка к конкурсу и провести вокальную медитацию для взрослого - это разные виды работы. А называем мы это одинаково: уроки вокала.\n\nВ «Педагогическом атласе» шесть форматов разобраны по восьми осям: кто заказчик, с каким запросом приходят, какая у педагога роль, где границы. И к каждому формату - как объяснить свою ценность тому, кто платит.\n\n${refLink(ROUTES.atlas, partner.code)}`}
          />

          <h3>Письмо ученикам: пересборка</h3>
          <CopyBox
            multiline
            value={`Здравствуйте!\n\nЕсли у вас накопился опыт, а собрать его во что-то свое не выходит - посмотрите «Профессиональную пересборку». Это две рабочие тетради, из которых вынимается ваш метод и то, что из него можно предлагать людям.\n\n${refLink(ROUTES.peresborka, partner.code)}`}
          />

          <p className="muted">
            【дополнительные тексты и материалы для партнеров: если у заказчика есть свои, они
            заменят эти черновики】
          </p>
        </section>
      )}

      {screen === 'visits' && (
        <section>
          <h2>Переходы</h2>
          {visits.length === 0 ? (
            <p className="muted">Переходов пока нет.</p>
          ) : (
            <div className="scroll-x">
              <table className="table">
                <thead>
                  <tr>
                    <th>День</th>
                    <th>Переходов</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v) => (
                    <tr key={v.day}>
                      <td>{v.day}</td>
                      <td>{v.count}</td>
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
          <h2>Начисления</h2>
          {accruals.length === 0 ? (
            <p className="muted">Начислений пока нет.</p>
          ) : (
            <div className="scroll-x">
              <table className="table">
                <thead>
                  <tr>
                    <th>Продукт</th>
                    <th>Дата</th>
                    <th>Ставка</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {accruals.map((a, i) => (
                    <tr key={i}>
                      <td>{a.title}</td>
                      <td>{new Date(a.created_at).toLocaleDateString('ru-RU')}</td>
                      <td>{Math.round(Number(a.rate) * 100)} процентов</td>
                      <td>{rubles(a.amount)}</td>
                      <td>{ACCRUAL_STATUS_LABEL[a.status] ?? a.status}</td>
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
          <h2>Мои ученики</h2>
          <p className="muted">
            Закрепленные за вами навсегда. Больше о них здесь ничего не показывается.
          </p>
          {students.length === 0 ? (
            <p className="muted">Пока никого.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Закреплен</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i}>
                    <td>{s.name ?? 'Без имени'}</td>
                    <td>{new Date(s.first_seen_at).toLocaleDateString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {screen === 'payouts' && (
        <section>
          <h2>Выплаты</h2>
          {payouts.length === 0 ? (
            <p className="muted">Выплат пока не было.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Продукт</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p, i) => (
                  <tr key={i}>
                    <td>{p.paid_at ? new Date(p.paid_at).toLocaleDateString('ru-RU') : '-'}</td>
                    <td>{p.title}</td>
                    <td>{rubles(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3>Реквизиты и налоговый статус</h3>
          <table className="table">
            <tbody>
              <tr>
                <th>Налоговый статус</th>
                <td>{partner.tax_status ?? 'не указан'}</td>
              </tr>
              <tr>
                <th>Реквизиты для перевода</th>
                <td>{partner.payout_details ?? 'не указаны'}</td>
              </tr>
            </tbody>
          </table>
          <p className="muted">
            Изменить реквизиты пока можно только письмом: 【порядок изменения реквизитов】
          </p>
        </section>
      )}
    </article>
  );
}
