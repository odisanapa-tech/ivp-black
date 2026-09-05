import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PARTNER } from '@/config/partner';
import { getProduct } from '@/config/products';
import { CONTACTS } from '@/config/site';
import { query } from '@/lib/db';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

/** Заявка с /proyavlennost и /formats. Оплаты здесь нет. */
export async function POST(req: Request) {
  const data = (await req.json().catch(() => ({}))) as {
    productId?: string;
    name?: string;
    contact?: string;
    comment?: string;
    consent?: boolean;
  };

  const product = data.productId ? getProduct(data.productId) : undefined;
  if (!product) return NextResponse.json({ error: 'Продукт не найден' }, { status: 400 });
  if (!data.name?.trim()) return NextResponse.json({ error: 'Укажите имя' }, { status: 400 });
  if (!data.contact?.trim()) {
    return NextResponse.json({ error: 'Оставьте контакт, чтобы ответить' }, { status: 400 });
  }
  if (data.consent !== true) {
    return NextResponse.json(
      { error: 'Нужно согласие на обработку персональных данных' },
      { status: 400 },
    );
  }

  const refCode = (await cookies()).get(PARTNER.cookieName)?.value ?? null;

  await query(
    `INSERT INTO leads (product_id, name, contact, comment, ref_code)
     VALUES ($1, $2, $3, $4, $5)`,
    [product.id, data.name.trim(), data.contact.trim(), data.comment?.trim() || null, refCode],
  );

  // Заявка дублируется письмом на почту заказчика.
  await sendEmail({
    to: CONTACTS.leadsEmail,
    subject: `Заявка: ${product.title}`,
    body:
      `Продукт: ${product.title}\n` +
      `Имя: ${data.name.trim()}\n` +
      `Контакт: ${data.contact.trim()}\n` +
      `Комментарий: ${data.comment?.trim() || '-'}\n` +
      `Партнерский код: ${refCode ?? '-'}\n`,
  });

  return NextResponse.json({ ok: true });
}
