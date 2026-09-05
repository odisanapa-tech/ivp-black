import type { Metadata } from 'next';
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
      <article>
        <h1>Админка не настроена</h1>
        <p>Задайте переменную окружения ADMIN_TOKEN и откройте /admin?token=значение</p>
      </article>
    );
  }
  if (token !== expected) {
    return (
      <article>
        <h1>Нет доступа</h1>
        <p className="muted">Откройте адрес со своим токеном.</p>
      </article>
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
    <article>
      <h1>Админка</h1>

      <h2>Партнеры</h2>
      <div className="scroll-x">
        <table className="table">
          <thead>
            <tr>
              <th>Код</th><th>Почта</th><th>Налоговый статус</th><th>Статус</th><th></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id}>
                <td>{p.code}</td>
                <td>{p.email}</td>
                <td>{p.tax_status ?? '-'}</td>
                <td>{p.status}</td>
                <td>
                  <form action={setPartnerStatus}>
                    <input type="hidden" name="token" value={token} />
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={p.status === 'active' ? 'suspended' : 'active'}
                    />
                    <button className="cta-secondary" style={{ padding: '8px 14px', fontSize: 16 }}>
                      {p.status === 'active' ? 'Приостановить' : 'Подтвердить'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Начисления</h2>
      <div className="scroll-x">
        <table className="table">
          <thead>
            <tr>
              <th>Партнер</th><th>Продукт</th><th>Ставка</th><th>Сумма</th><th>Статус</th><th></th>
            </tr>
          </thead>
          <tbody>
            {accruals.map((a) => (
              <tr key={a.id}>
                <td>{a.code}</td>
                <td>{a.title}</td>
                <td>{Math.round(Number(a.rate) * 100)} процентов</td>
                <td>{rubles(a.amount)}</td>
                <td>{ACCRUAL_STATUS_LABEL[a.status] ?? a.status}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  {a.status === 'pending_confirmation' && (
                    <form action={setAccrualStatus}>
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="status" value="payable" />
                      <button className="cta-secondary" style={{ padding: '8px 14px', fontSize: 16 }}>
                        К выплате
                      </button>
                    </form>
                  )}
                  {a.status === 'payable' && (
                    <form action={setAccrualStatus}>
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="status" value="paid" />
                      <button className="cta-secondary" style={{ padding: '8px 14px', fontSize: 16 }}>
                        Выплачено
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Заказы</h2>
      <div className="scroll-x">
        <table className="table">
          <thead>
            <tr>
              <th>Номер</th><th>Почта</th><th>Продукт</th><th>Сумма</th><th>Статус</th><th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.email}</td>
                <td>{o.title}</td>
                <td>{rubles(o.amount)}</td>
                <td>{o.status}</td>
                <td>
                  {o.status === 'paid' && (
                    <form action={completeOrder}>
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="id" value={o.id} />
                      <button className="cta-secondary" style={{ padding: '8px 14px', fontSize: 16 }}>
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

      <h2>Заявки</h2>
      <table className="table">
        <thead>
          <tr><th>Имя</th><th>Контакт</th><th>Продукт</th><th>Когда</th></tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td>{l.contact}</td>
              <td>{l.product_id}</td>
              <td>{new Date(l.created_at).toLocaleString('ru-RU')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Письма</h2>
      <p className="muted">
        Настоящая отправка не подключена, письма копятся здесь.
      </p>
      <table className="table">
        <thead>
          <tr><th>Кому</th><th>Тема</th><th>Когда</th></tr>
        </thead>
        <tbody>
          {emails.map((m) => (
            <tr key={m.id}>
              <td>{m.to_email}</td>
              <td>{m.subject}</td>
              <td>{new Date(m.created_at).toLocaleString('ru-RU')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
