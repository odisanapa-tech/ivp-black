import type { Metadata } from 'next';
import Link from 'next/link';
import { DevMarkPaid } from '@/components/DevMarkPaid';
import { ROUTES } from '@/config/site';

export const metadata: Metadata = { title: 'Оплата' };

/**
 * Заглушка вместо эквайринга. Настоящий прием оплаты на этом этапе
 * не подключается.
 */
export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderId = order ? Number(order) : null;
  const devMode =
    process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_PAYMENTS === '1';

  return (
    <article>
      <h1>Здесь будет оплата</h1>
      <p className="lead">
        Прием платежей еще не подключен. Заказ создан и сохранен, оплатить его пока нельзя.
      </p>
      {orderId && <p className="muted">Номер заказа: {orderId}</p>}

      {devMode && orderId && <DevMarkPaid orderId={orderId} />}

      <p>
        <Link href={ROUTES.home}>Вернуться на главную</Link>
      </p>
    </article>
  );
}
