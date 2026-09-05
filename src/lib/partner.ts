import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { PARTNER } from '@/config/partner';
import { query, queryOne } from '@/lib/db';

export const PARTNER_SESSION_COOKIE = 'ivp_partner_session';

export type PartnerRow = {
  id: number;
  user_id: number;
  code: string;
  status: string;
  payout_details: string | null;
  tax_status: string | null;
  name: string | null;
  email: string;
};

/** Код партнера. Короткий, читаемый вслух, без похожих друг на друга символов. */
export function generateCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/** Партнер текущей сессии. Пароля нет, вход по ссылке из письма. */
export async function currentPartner(): Promise<PartnerRow | undefined> {
  const token = (await cookies()).get(PARTNER_SESSION_COOKIE)?.value;
  if (!token) return undefined;
  return queryOne<PartnerRow>(
    `SELECT p.*, u.name, u.email
       FROM partner_login_tokens t
       JOIN partners p ON p.id = t.partner_id
       JOIN users u ON u.id = p.user_id
      WHERE t.token = $1 AND t.expires_at > now()`,
    [token],
  );
}

/** Экран "Переходы". */
export function partnerVisits(partnerId: number) {
  return query<{ day: string; count: string }>(
    `SELECT to_char(date_trunc('day', created_at), 'DD.MM.YYYY') AS day, count(*) AS count
       FROM ref_visits WHERE partner_id = $1
      GROUP BY 1, date_trunc('day', created_at)
      ORDER BY date_trunc('day', created_at) DESC
      LIMIT 60`,
    [partnerId],
  );
}

/** Экран "Начисления". */
export function partnerAccruals(partnerId: number) {
  return query<{
    title: string;
    created_at: Date;
    status: string;
    amount: string;
    rate: string;
  }>(
    `SELECT pr.title, a.created_at, a.status, a.amount, a.rate
       FROM accruals a
       JOIN orders o ON o.id = a.order_id
       JOIN products pr ON pr.id = o.product_id
      WHERE a.partner_id = $1
      ORDER BY a.created_at DESC`,
    [partnerId],
  );
}

/**
 * Экран "Мои ученики". Только имя и дата закрепления:
 * почты и сумм партнер не видит.
 */
export function partnerStudents(partnerId: number) {
  return query<{ name: string | null; first_seen_at: Date }>(
    `SELECT u.name, a.first_seen_at
       FROM attributions a JOIN users u ON u.id = a.user_id
      WHERE a.partner_id = $1
      ORDER BY a.first_seen_at DESC`,
    [partnerId],
  );
}

/** Экран "Выплаты". */
export function partnerPayouts(partnerId: number) {
  return query<{ paid_at: Date; amount: string; title: string }>(
    `SELECT a.paid_at, a.amount, pr.title
       FROM accruals a
       JOIN orders o ON o.id = a.order_id
       JOIN products pr ON pr.id = o.product_id
      WHERE a.partner_id = $1 AND a.status = 'paid'
      ORDER BY a.paid_at DESC`,
    [partnerId],
  );
}

export const ACCRUAL_STATUS_LABEL: Record<string, string> = {
  pending_confirmation: 'Ожидает подтверждения',
  payable: 'К выплате',
  paid: 'Выплачено',
  cancelled: 'Отменено',
};

export function rubles(kopecks: string | number): string {
  return `${(Number(kopecks) / 100).toLocaleString('ru-RU')} руб.`;
}

export const LOGIN_TTL_HOURS = PARTNER.loginLinkHours;
