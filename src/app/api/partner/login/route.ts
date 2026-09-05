import { NextResponse } from 'next/server';
import { PARTNER } from '@/config/partner';
import { ROUTES, SITE_URL } from '@/config/site';
import { query, queryOne } from '@/lib/db';
import { PARTNER_SESSION_COOKIE } from '@/lib/partner';

export const runtime = 'nodejs';

/**
 * Вход в кабинет по ссылке из письма. Пароля на этом этапе нет.
 *
 * РЕШЕНИЕ ПРИНЯТО ЗА ЗАКАЗЧИКА: ссылка живет 72 часа, и столько же живет
 * сессия в браузере. Срок в ТЗ не задан.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  const base = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;

  if (!token) return NextResponse.redirect(new URL(ROUTES.partner, base));

  const found = await queryOne<{ partner_id: number }>(
    'SELECT partner_id FROM partner_login_tokens WHERE token = $1 AND expires_at > now()',
    [token],
  );
  if (!found) {
    return NextResponse.redirect(new URL(`${ROUTES.partner}?login=expired`, base));
  }

  await query('UPDATE partner_login_tokens SET used_at = COALESCE(used_at, now()) WHERE token = $1', [
    token,
  ]);

  const res = NextResponse.redirect(new URL(ROUTES.partnerCabinet, base));
  res.cookies.set(PARTNER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: PARTNER.loginLinkHours * 60 * 60,
  });
  return res;
}
