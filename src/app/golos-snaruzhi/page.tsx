import type { Metadata } from 'next';
import { BuyForm } from '@/components/BuyForm';
import { ProductLayout } from '@/components/ProductLayout';
import { formatPrice, getProduct } from '@/config/products';
import { ROUTES } from '@/config/site';

export const metadata: Metadata = { title: 'Ваш голос снаружи' };

/** Текст страницы из раздела 7.4 ТЗ. */
export default function GolosSnaruzhiPage() {
  const product = getProduct('golos-snaruzhi')!;

  return (
    <ProductLayout
      kicker="Ваш голос снаружи, Мария Осадчая"
      h1="Ваш голос снаружи"
      authorNote="Автор: Мария Осадчая."
      sections={[
        {
          body: (
            <p>
              Каждый пост приходится начинать с нуля: кто я сегодня, о чем вообще говорить, а не
              покажусь ли я смешной. В итоге не пишется ничего, или пишется раз в три месяца и не
              то.
            </p>
          ),
        },
        {
          title: 'Что внутри',
          body: (
            <>
              <p>
                Рабочая тетрадь на двадцать две страницы, восемь разделов. Проходится
                самостоятельно: без встреч, без созвонов, без того, чтобы кто-то смотрел вам через
                плечо.
              </p>
              <p>
                Заканчивается не подписью под планом, а опубликованным постом. Своим, написанным
                вами, в течение двух суток после последнего раздела.
              </p>
            </>
          ),
        },
        {
          title: 'Что на выходе',
          body: (
            <p>
              Понимание, о чем вы говорите миру и какими словами. И один пост, который уже вышел.
            </p>
          ),
        },
      ]}
      buy={
        <>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-3">Цена</h2>
          <p className="text-[20px] text-ink font-medium mb-2">{formatPrice(product.price)}</p>
          <p className="text-[16px] text-muted mb-7">Формат: PDF на почту.</p>
          <BuyForm products={[product]} cta="Получить тетрадь" />
        </>
      }
      next={{
        text: 'Голос снаружи - это про то, как говорить. Следующий шаг - собрать то, о чем говорить: свой метод и то, что из него можно предлагать',
        href: ROUTES.peresborka,
        label: 'Профессиональная пересборка',
      }}
    />
  );
}
