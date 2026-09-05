import { randomBytes } from 'node:crypto';
import type { PoolClient } from 'pg';
import { PARTNER, accrualAmount, commissionRate } from '@/config/partner';
import { absoluteUrl, ROUTES } from '@/config/site';
import { query, queryOne, transaction } from '@/lib/db';
import { sendEmail } from '@/lib/email';

/** Сколько дней живет ссылка на скачивание. Платят с телефона, открывают с компьютера. */
const DOWNLOAD_DAYS = 30;

export type OrderRow = {
  id: number;
  user_id: number;
  product_id: string;
  amount: string | number;
  status: string;
  paid_at: Date | null;
  download_token: string | null;
  download_expires_at: Date | null;
  ref_code: string | null;
};

/**
 * Учетная запись заводится автоматически при первой покупке, по email.
 * Пароля на этом этапе нет.
 */
export async function findOrCreateUser(
  client: PoolClient,
  email: string,
  name: string | null,
): Promise<number> {
  const found = await client.query<{ id: number }>(
    'SELECT id FROM users WHERE lower(email) = lower($1)',
    [email],
  );
  if (found.rows[0]) {
    // Имя дописываем, если раньше его не было. Существующее не перетираем.
    if (name) {
      await client.query('UPDATE users SET name = COALESCE(name, $2) WHERE id = $1', [
        found.rows[0].id,
        name,
      ]);
    }
    return found.rows[0].id;
  }
  const created = await client.query<{ id: number }>(
    'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id',
    [email, name],
  );
  return created.rows[0].id;
}

/** Создать заказ в статусе "ожидает оплаты". */
export async function createOrder(input: {
  email: string;
  name: string | null;
  productId: string;
  amount: number;
  /** Код партнера из cookie на момент оформления. */
  refCode: string | null;
}): Promise<{ orderId: number; userId: number }> {
  return transaction(async (client) => {
    const userId = await findOrCreateUser(client, input.email, input.name);
    const res = await client.query<{ id: number }>(
      `INSERT INTO orders (user_id, product_id, amount, status, ref_code)
       VALUES ($1, $2, $3, 'pending', $4) RETURNING id`,
      [userId, input.productId, input.amount, input.refCode],
    );
    return { orderId: res.rows[0].id, userId };
  });
}

/**
 * Подтверждение оплаты. Здесь же закрепляется партнер и считается начисление:
 * все три записи делаются одной транзакцией, иначе можно получить оплату
 * без атрибуции и потерять связку навсегда.
 *
 * refCode - запасной источник кода, если в заказе его нет.
 * Основной источник - orders.ref_code, снятый с cookie при оформлении.
 */
export async function markOrderPaid(
  orderId: number,
  paidAmount: number,
  refCode: string | null = null,
): Promise<{ ok: boolean; reason?: string }> {
  return transaction(async (client) => {
    const order = await client.query<OrderRow>(
      'SELECT * FROM orders WHERE id = $1 FOR UPDATE',
      [orderId],
    );
    const row = order.rows[0];
    if (!row) return { ok: false, reason: 'Заказ не найден' };
    if (row.status === 'paid' || row.status === 'completed') {
      return { ok: false, reason: 'Заказ уже оплачен' };
    }

    // Первая ли это покупка ученика. Считается до того, как текущий заказ
    // станет оплаченным, иначе он посчитает сам себя.
    const before = await client.query<{ count: string }>(
      `SELECT count(*) FROM orders
       WHERE user_id = $1 AND id <> $2 AND status IN ('paid', 'completed')`,
      [row.user_id, orderId],
    );
    const isFirstPurchase = Number(before.rows[0].count) === 0;

    const token = randomBytes(24).toString('hex');
    await client.query(
      `UPDATE orders
         SET status = 'paid', amount = $2, paid_at = now(),
             download_token = $3,
             download_expires_at = now() + ($4 || ' days')::interval
       WHERE id = $1`,
      [orderId, paidAmount, token, String(DOWNLOAD_DAYS)],
    );

    // Закрепление. Если запись уже есть, cookie игнорируется:
    // первый партнер закреплен за учеником навсегда.
    const existing = await client.query<{ partner_id: number }>(
      'SELECT partner_id FROM attributions WHERE user_id = $1',
      [row.user_id],
    );
    let partnerId: number | null = existing.rows[0]?.partner_id ?? null;

    const codeForAttribution = row.ref_code ?? refCode;

    if (!existing.rows[0] && codeForAttribution) {
      const partner = await client.query<{ id: number }>(
        `SELECT id FROM partners WHERE code = $1 AND status = 'active'`,
        [codeForAttribution],
      );
      // Партнер не может быть закреплен сам за собой.
      if (partner.rows[0]) {
        const self = await client.query<{ id: number }>(
          'SELECT id FROM partners WHERE user_id = $1',
          [row.user_id],
        );
        if (self.rows[0]?.id !== partner.rows[0].id) {
          await client.query(
            `INSERT INTO attributions (user_id, partner_id, locked) VALUES ($1, $2, true)`,
            [row.user_id, partner.rows[0].id],
          );
          partnerId = partner.rows[0].id;
        }
      }
    }

    // Начисление. Ставка кладется в строку вместе с суммой: конфиг может
    // поменяться, а уже посчитанное вознаграждение должно остаться проверяемым.
    if (partnerId) {
      const rate = commissionRate(isFirstPurchase);
      const amount = accrualAmount(paidAmount, isFirstPurchase);
      await client.query(
        `INSERT INTO accruals (order_id, partner_id, rate, amount, status)
         VALUES ($1, $2, $3, $4, 'pending_confirmation')
         ON CONFLICT (order_id) DO NOTHING`,
        [orderId, partnerId, rate, amount],
      );
    }

    return { ok: true };
  }).then(async (result) => {
    if (result.ok) await sendPurchaseEmail(orderId);
    return result;
  });
}

/** Письмо с файлом. Дублирует то, что показано на /spasibo. */
async function sendPurchaseEmail(orderId: number): Promise<void> {
  const row = await queryOne<{ email: string; token: string; title: string }>(
    `SELECT u.email, o.download_token AS token, p.title
       FROM orders o JOIN users u ON u.id = o.user_id JOIN products p ON p.id = o.product_id
      WHERE o.id = $1`,
    [orderId],
  );
  if (!row?.token) return;
  const link = absoluteUrl(`${ROUTES.spasibo}?t=${row.token}`);
  await sendEmail({
    to: row.email,
    subject: `${row.title}: ваш файл`,
    body:
      `Спасибо за покупку.\n\n` +
      `Скачать: ${link}\n\n` +
      `Ссылка работает ${DOWNLOAD_DAYS} дней. Если открываете с телефона, ` +
      `письмо можно открыть позже с компьютера - ссылка та же.`,
  });
}

/** Партнер по коду из cookie. Нужен, чтобы не писать мусор в ref_visits. */
export async function activePartnerByCode(code: string): Promise<{ id: number } | undefined> {
  return queryOne<{ id: number }>(
    `SELECT id FROM partners WHERE code = $1 AND status = 'active'`,
    [code],
  );
}

export const REF_COOKIE = PARTNER.cookieName;

/** Заказ по токену скачивания, если ссылка еще жива. */
export async function orderByDownloadToken(token: string) {
  return queryOne<{ id: number; title: string; product_id: string; expires: Date }>(
    `SELECT o.id, p.title, o.product_id, o.download_expires_at AS expires
       FROM orders o JOIN products p ON p.id = o.product_id
      WHERE o.download_token = $1 AND o.download_expires_at > now()`,
    [token],
  );
}

export { DOWNLOAD_DAYS };
