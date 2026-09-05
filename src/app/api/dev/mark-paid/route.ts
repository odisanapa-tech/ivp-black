import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PARTNER } from '@/config/partner';
import { markOrderPaid } from '@/lib/orders';

export const runtime = 'nodejs';

/**
 * Кнопка "считать оплаченным". Только режим разработки: без нее сценарий
 * с меткой, закреплением и начислением не проверить.
 *
 * На боевом стенде обработчик отвечает 404, как будто его нет.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEV_PAYMENTS !== '1') {
    return NextResponse.json({ error: 'Недоступно' }, { status: 404 });
  }

  const data = (await req.json().catch(() => ({}))) as { orderId?: number; amount?: number };
  if (!data.orderId) return NextResponse.json({ error: 'Нет orderId' }, { status: 400 });

  const refCode = (await cookies()).get(PARTNER.cookieName)?.value ?? null;
  const result = await markOrderPaid(Number(data.orderId), Number(data.amount ?? 0), refCode);

  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 400 });
  return NextResponse.json({ ok: true });
}
