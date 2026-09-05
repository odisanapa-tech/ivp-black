import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/site/PageHeader';
import { queryOne } from '@/lib/db';
import { DOWNLOAD_DAYS, orderByDownloadToken } from '@/lib/orders';
import { ROUTES } from '@/config/site';

export const metadata: Metadata = { title: 'Спасибо' };
export const dynamic = 'force-dynamic';

/**
 * Страница после оплаты. Файл выдается здесь и дублируется письмом.
 * Ссылка живет не меньше 30 дней: платят с телефона, а открывают
 * с компьютера.
 */
export default async function SpasiboPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; order?: string }>;
}) {
  const { t, order } = await searchParams;

  const byToken = t ? await orderByDownloadToken(t) : undefined;
  const byOrder =
    !byToken && order
      ? await queryOne<{ id: number; title: string; download_token: string | null }>(
          `SELECT o.id, p.title, o.download_token
             FROM orders o JOIN products p ON p.id = o.product_id
            WHERE o.id = $1 AND o.status IN ('paid', 'completed')`,
          [Number(order)],
        )
      : undefined;

  const title = byToken?.title ?? byOrder?.title;

  if (!title) {
    return (
      <>
        <PageHeader
          title="Ссылка не найдена"
          lead={`Возможно, срок ссылки истек: она живет ${DOWNLOAD_DAYS} дней. Напишите нам, и мы вышлем файл заново.`}
        />
        <div className="container-prose pb-20">
          <Link href={ROUTES.home} className="link-underline text-[17px]">
            На главную
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        kicker="Спасибо"
        title="Файл ваш"
        lead={`${title}. Ссылка продублирована письмом и работает ${DOWNLOAD_DAYS} дней: если сейчас вы с телефона, письмо можно открыть позже с компьютера.`}
      />
      <div className="container-prose pb-20 md:pb-28">
        <div className="rounded-lg border border-dashed border-rule bg-card/60 p-6 mb-8">
          <p className="text-[17px] text-ink/90 mb-5">
            <strong>【файл продукта】</strong> - файл еще не передан заказчиком, поэтому скачивание
            не работает.
          </p>
          <Button disabled>Скачать</Button>
        </div>
        <Link href={ROUTES.home} className="link-underline text-[17px]">
          На главную
        </Link>
      </div>
    </>
  );
}
