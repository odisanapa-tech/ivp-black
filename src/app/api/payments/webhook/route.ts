import { NextResponse } from 'next/server';
import { markOrderPaid } from '@/lib/orders';
import { paymentProvider } from '@/lib/payments';

export const runtime = 'nodejs';

/**
 * Точка входа для уведомлений эквайринга. Сейчас работает через заглушку,
 * настоящий провайдер подключается заменой реализации в paymentProvider().
 *
 * Партнерский код берется из самого заказа: он снят с cookie при
 * оформлении. В уведомлении от платежной системы браузера покупателя нет.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const event = await paymentProvider().handleWebhook(body, req.headers);
    if (event.status !== 'paid') return NextResponse.json({ ok: true });
    const result = await markOrderPaid(event.orderId, event.paidAmount);
    return NextResponse.json({ ok: result.ok });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
