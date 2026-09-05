import type { Metadata } from 'next';
import Link from 'next/link';
import { DevMarkPaid } from '@/components/DevMarkPaid';
import { PageHeader } from '@/components/site/PageHeader';
import { ROUTES } from '@/config/site';

export const metadata: Metadata = { title: 'Оплата' };

/** Заглушка вместо эквайринга. Настоящий прием оплаты не подключен. */
export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderId = order ? Number(order) : null;
  const devMode = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_PAYMENTS === '1';

  return (
    <>
      <PageHeader
        kicker="Оплата"
        title="Здесь будет оплата"
        lead="Прием платежей еще не подключен. Заказ создан и сохранен, оплатить его пока нельзя."
      />
      <div className="container-prose pb-20 md:pb-28">
        {orderId && <p className="text-[15px] text-muted mb-8">Номер заказа: {orderId}</p>}
        {devMode && orderId && (
          <div className="mb-10">
            <DevMarkPaid orderId={orderId} />
          </div>
        )}
        <Link href={ROUTES.home} className="link-underline text-[17px]">
          Вернуться на главную
        </Link>
      </div>
    </>
  );
}
