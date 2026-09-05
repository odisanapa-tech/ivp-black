import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PARTNER } from '@/config/partner';
import { getProduct } from '@/config/products';
import { createOrder } from '@/lib/orders';
import { paymentProvider } from '@/lib/payments';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Оформление покупки. Минимум полей: email плюс имя, плюс согласие. */
export async function POST(req: Request) {
  const data = (await req.json().catch(() => ({}))) as {
    productId?: string;
    email?: string;
    name?: string;
    consent?: boolean;
  };

  const product = data.productId ? getProduct(data.productId) : undefined;
  if (!product || product.kind !== 'file') {
    return NextResponse.json({ error: 'Продукт не найден' }, { status: 400 });
  }
  if (!data.email || !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: 'Проверьте адрес почты' }, { status: 400 });
  }
  if (!data.name?.trim()) {
    return NextResponse.json({ error: 'Как к вам обращаться' }, { status: 400 });
  }
  // Согласие обязательно и отдельным действием: галочка не предзаполнена,
  // конклюдентное согласие не используется.
  if (data.consent !== true) {
    return NextResponse.json(
      { error: 'Нужно согласие на обработку персональных данных' },
      { status: 400 },
    );
  }

  // Код партнера снимается с cookie здесь, в момент оформления, и живет
  // в заказе. При подтверждении оплаты cookie может быть уже недоступна.
  const refCode = (await cookies()).get(PARTNER.cookieName)?.value ?? null;

  const { orderId } = await createOrder({
    email: data.email.trim(),
    name: data.name.trim(),
    productId: product.id,
    // Цена заказчиком не назначена. Ноль здесь - честное "суммы еще нет",
    // а не выдуманное число: на черновике сумма задается в режиме разработки.
    amount: product.price ?? 0,
    refCode,
  });

  const payment = await paymentProvider().createPayment({
    orderId,
    productId: product.id,
    amount: product.price ?? 0,
    email: data.email.trim(),
    name: data.name.trim(),
  });

  return NextResponse.json({ redirectUrl: payment.redirectUrl });
}
