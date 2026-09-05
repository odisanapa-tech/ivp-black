import { NextResponse } from 'next/server';
import { absoluteUrl, ROUTES } from '@/config/site';
import { transaction } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { findOrCreateUser } from '@/lib/orders';
import { generateCode, generateToken, LOGIN_TTL_HOURS } from '@/lib/partner';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Подключение к партнерской программе.
 *
 * РЕШЕНИЕ ПРИНЯТО ЗА ЗАКАЗЧИКА: заявка создает партнера сразу, но в статусе
 * "ожидает подтверждения". Начисления такому партнеру не идут, пока его
 * не переведут в активные вручную из админки. Порядка подключения в ТЗ нет.
 */
export async function POST(req: Request) {
  const data = (await req.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    taxStatus?: string;
    consent?: boolean;
  };

  if (!data.name?.trim()) return NextResponse.json({ error: 'Укажите имя' }, { status: 400 });
  if (!data.email || !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: 'Проверьте адрес почты' }, { status: 400 });
  }
  if (!data.taxStatus?.trim()) {
    return NextResponse.json({ error: 'Укажите налоговый статус' }, { status: 400 });
  }
  if (data.consent !== true) {
    return NextResponse.json(
      { error: 'Нужно согласие на обработку персональных данных' },
      { status: 400 },
    );
  }

  const { code, token, isNew } = await transaction(async (client) => {
    const userId = await findOrCreateUser(client, data.email!.trim(), data.name!.trim());

    const existing = await client.query<{ id: number; code: string }>(
      'SELECT id, code FROM partners WHERE user_id = $1',
      [userId],
    );

    let partnerId: number;
    let partnerCode: string;
    let created = false;

    if (existing.rows[0]) {
      partnerId = existing.rows[0].id;
      partnerCode = existing.rows[0].code;
    } else {
      partnerCode = generateCode();
      const inserted = await client.query<{ id: number }>(
        `INSERT INTO partners (user_id, code, status, tax_status)
         VALUES ($1, $2, 'pending', $3) RETURNING id`,
        [userId, partnerCode, data.taxStatus!.trim()],
      );
      partnerId = inserted.rows[0].id;
      created = true;
    }

    const loginToken = generateToken();
    await client.query(
      `INSERT INTO partner_login_tokens (token, partner_id, expires_at)
       VALUES ($1, $2, now() + ($3 || ' hours')::interval)`,
      [loginToken, partnerId, String(LOGIN_TTL_HOURS)],
    );

    return { code: partnerCode, token: loginToken, isNew: created };
  });

  await sendEmail({
    to: data.email.trim(),
    subject: 'Партнерская программа ИВП: вход в кабинет',
    body:
      `Ваш партнерский код: ${code}\n\n` +
      `Войти в кабинет: ${absoluteUrl(`/api/partner/login?token=${token}`)}\n\n` +
      `Ссылка работает ${LOGIN_TTL_HOURS} часа. Пароля нет: каждый раз вход по новой ссылке.\n` +
      (isNew ? 'Заявка принята, начисления начнут считаться после подтверждения.\n' : ''),
  });

  return NextResponse.json({ ok: true, redirect: ROUTES.partner });
}
