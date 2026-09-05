import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/PageHeader';
import { query } from '@/lib/db';
import { ACCRUAL_STATUS_LABEL, rubles } from '@/lib/partner';
import { completeOrder, setAccrualStatus, setPartnerStatus } from './actions';

export const metadata: Metadata = { title: 'Админка' };
export const dynamic = 'force-dynamic';

/** Минимальная админка. Вход по токену в адресе: /admin?token=... */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return (
      <>
        <PageHeader title="Админка не настроена" />
        <div className="container-prose pb-20">
          <p className="text-[17px] text-ink/90">
            Задайте переменную окружения ADMIN_TOKEN и откройте /admin?token=значение
          </p>
        </div>
      </>
    );
  }
  if (token !== expected) {
    return (
      <>
        <PageHeader title="Нет доступа" />
        <div className="container-prose pb-20">
          <p className="text-[17px] text-muted">Откройте адрес со своим токеном.</p>
        </div>
      </>
    );
  }

  const [orders, accruals, partners, emails, leads] = await Promise.all([
    query<{
      id: number; email: string; title: string; amount: string;
      status: string; created_at: Date;
    }>(
      `SELECT o.id, u.email, p.title, o.amount, o.status, o.created_at
         FROM orders o JOIN users u ON u.id = o.user_id JOIN products p ON p.id = o.product_id
        ORDER BY o.created_at DESC LIMIT 100`,
    ),
    query<{
      id: number; code: string; title: string; rate: string;
      amount: string; status: string; created_at: Date;
    }>(
      `SELECT a.id, pt.code, pr.title, a.rate, a.amount, a.status, a.created_at
         FROM accruals a
         JOIN partners pt ON pt.id = a.partner_id
         JOIN orders o ON o.id = a.order_id
         JOIN products pr ON pr.id = o.product_id
        ORDER BY a.created_at DESC LIMIT 100`,
    ),
    query<{ id: number; code: string; status: string; email: string; tax_status: string | null }>(
      `SELECT pt.id, pt.code, pt.status, u.email, pt.tax_status
         FROM partners pt JOIN users u ON u.id = pt.user_id
        ORDER BY pt.created_at DESC LIMIT 100`,
    ),
    query<{ id: number; to_email: string; subject: string; created_at: Date }>(
      `SELECT id, to_email, subject, created_at FROM emails ORDER BY created_at DESC LIMIT 30`,
    ),
    query<{ id: number; name: string; contact: string; product_id: string; created_at: Date }>(
      `SELECT id, name, contact, product_id, created_at FROM leads ORDER BY created_at DESC LIMIT 50`,
    ),
  ]);

  return (
    <>
      <PageHeader kicker="Служебное" title="Админка" wide />
      <div className="container-tight pb-20 md:pb-28">

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">Партнеры</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] border-collapse mb-10">
          <thead>
            <tr>
              <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Код</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Почта</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Налоговый статус</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Статус</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id}>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{p.code}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{p.email}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{p.tax_status ?? '-'}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{p.status}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">
                  <form action={setPartnerStatus}>
                    <input type="hidden" name="token" value={token} />
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={p.status === 'active' ? 'suspended' : 'active'}
                    />
                    <button className="rounded-md border border-rule bg-page px-3.5 py-2 text-[14px] text-ink hover:border-accent hover:text-accent transition-colors whitespace-nowrap">
                      {p.status === 'active' ? 'Приостановить' : 'Подтвердить'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">Начисления</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] border-collapse mb-10">
          <thead>
            <tr>
              <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Партнер</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Продукт</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Ставка</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Сумма</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Статус</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {accruals.map((a) => (
              <tr key={a.id}>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{a.code}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{a.title}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{Math.round(Number(a.rate) * 100)} процентов</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{rubles(a.amount)}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{ACCRUAL_STATUS_LABEL[a.status] ?? a.status}</td>
                <td className="py-3 px-2 border-b border-rule align-top"><div className="flex gap-2">
                  {a.status === 'pending_confirmation' && (
                    <form action={setAccrualStatus}>
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="status" value="payable" />
                      <button className="rounded-md border border-rule bg-page px-3.5 py-2 text-[14px] text-ink hover:border-accent hover:text-accent transition-colors whitespace-nowrap">
                        К выплате
                      </button>
                    </form>
                  )}
                  {a.status === 'payable' && (
                    <form action={setAccrualStatus}>
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="status" value="paid" />
                      <button className="rounded-md border border-rule bg-page px-3.5 py-2 text-[14px] text-ink hover:border-accent hover:text-accent transition-colors whitespace-nowrap">
                        Выплачено
                      </button>
                    </form>
                  )}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">Заказы</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] border-collapse mb-10">
          <thead>
            <tr>
              <th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Номер</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Почта</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Продукт</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Сумма</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Статус</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{o.id}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{o.email}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{o.title}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{rubles(o.amount)}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{o.status}</td>
                <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">
                  {o.status === 'paid' && (
                    <form action={completeOrder}>
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="id" value={o.id} />
                      <button className="rounded-md border border-rule bg-page px-3.5 py-2 text-[14px] text-ink hover:border-accent hover:text-accent transition-colors whitespace-nowrap">
                        Продукт завершен
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">Заявки</h2>
      <table className="w-full text-[15px] border-collapse mb-10">
        <thead>
          <tr><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Имя</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Контакт</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Продукт</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Когда</th></tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{l.name}</td>
              <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{l.contact}</td>
              <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{l.product_id}</td>
              <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{new Date(l.created_at).toLocaleString('ru-RU')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">Письма</h2>
      <p className="text-[15px] text-muted mb-4">
        Настоящая отправка не подключена, письма копятся здесь.
      </p>
      <table className="w-full text-[15px] border-collapse mb-10">
        <thead>
          <tr><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Кому</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Тема</th><th className="text-left py-3 px-2 border-b border-rule text-[14px] text-muted font-medium">Когда</th></tr>
        </thead>
        <tbody>
          {emails.map((m) => (
            <tr key={m.id}>
              <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{m.to_email}</td>
              <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{m.subject}</td>
              <td className="text-left py-3 px-2 border-b border-rule text-ink align-top">{new Date(m.created_at).toLocaleString('ru-RU')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
