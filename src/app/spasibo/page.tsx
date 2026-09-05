import type { Metadata } from 'next';
import Link from 'next/link';
import { DOWNLOAD_DAYS, orderByDownloadToken } from '@/lib/orders';
import { queryOne } from '@/lib/db';
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
  const token = t ?? byOrder?.download_token ?? null;

  if (!title) {
    return (
      <article>
        <h1>Ссылка не найдена</h1>
        <p>
          Возможно, срок ссылки истек: она живет {DOWNLOAD_DAYS} дней. Напишите нам, и мы вышлем
          файл заново.
        </p>
        <p>
          <Link href={ROUTES.home}>На главную</Link>
        </p>
      </article>
    );
  }

  return (
    <article>
      <h1>Спасибо. Файл ваш</h1>
      <p className="lead">{title}</p>
      <p>
        Ссылка продублирована письмом на вашу почту и работает {DOWNLOAD_DAYS} дней. Если сейчас вы
        с телефона, можно открыть письмо позже с компьютера.
      </p>

      <div className="card">
        {/* ЗАГЛУШКА: самого файла заказчик пока не передал. */}
        <p>
          <strong>【файл продукта】</strong> - файл еще не передан заказчиком, поэтому скачивание
          не работает.
        </p>
        <button className="cta" disabled>
          Скачать
        </button>
        {token && <p className="muted" style={{ marginTop: 16 }}>Код ссылки: {token.slice(0, 8)}...</p>}
      </div>

      <p>
        <Link href={ROUTES.home}>На главную</Link>
      </p>
    </article>
  );
}
