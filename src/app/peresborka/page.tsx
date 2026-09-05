import type { Metadata } from 'next';
import { BuyForm } from '@/components/BuyForm';
import { ProductLayout } from '@/components/ProductLayout';
import { formatPrice, getProduct } from '@/config/products';
import { ROUTES } from '@/config/site';

export const metadata: Metadata = { title: 'Профессиональная пересборка' };

/**
 * Текст продукта заказчиком пока не передан. Страница сверстана по шаблону
 * из 7.2 с видимыми заглушками: выдуманного текста здесь нет.
 */
export default function PeresborkaPage() {
  const base = getProduct('peresborka-base')!;
  const razbor = getProduct('peresborka-razbor')!;

  return (
    <ProductLayout
      h1="Профессиональная пересборка"
      sections={[
        {
          body: (
            <p>
              【ситуация: текст заказчика. Из чего человек приходит - его словами, а не названием
              дисциплины】
            </p>
          ),
        },
        {
          title: 'Что внутри',
          body: (
            <>
              <p>
                Две рабочие тетради. Вы собираете свой багаж, достижения и то, что умеете и сами за
                способность не считаете. Из заполненных тетрадей вынимается ваш метод и то, что из
                него можно продавать.
              </p>
              <p>【что внутри: развернутый текст заказчика】</p>
            </>
          ),
        },
        {
          title: 'Что на выходе',
          body: <p>【что на выходе: текст заказчика】</p>,
        },
        {
          title: 'Два варианта',
          body: (
            <>
              {/* Разница объясняется одной строкой, а не таблицей. */}
              <p>
                Разница одна: в тарифе с разбором к тетрадям добавляется личная встреча, на которой
                собранное разбирается вместе с вами.
              </p>
              <div className="box">
                <h3 style={{ margin: '0 0 8px' }}>{base.title}</h3>
                <p style={{ margin: '0 0 8px' }}>Две тетради, работаете сами.</p>
                <p className="muted" style={{ margin: 0 }}>{formatPrice(base.price)}</p>
              </div>
              <div className="box">
                <h3 style={{ margin: '0 0 8px' }}>{razbor.title}</h3>
                <p style={{ margin: '0 0 8px' }}>Тетради плюс личная встреча с разбором.</p>
                <p style={{ margin: '0 0 8px' }}>
                  Бонусом в этот вариант входит <strong>карта рынка вашего города</strong>: кто уже
                  работает рядом, с кем вы на самом деле стоите в одном ряду и чем от них
                  отличаетесь.
                </p>
                <p className="muted" style={{ margin: 0 }}>{formatPrice(razbor.price)}</p>
              </div>
            </>
          ),
        },
      ]}
      buy={
        <>
          <h2>Выбрать вариант</h2>
          <BuyForm products={[base, razbor]} cta="Перейти к оплате" />
        </>
      }
      next={{
        text: 'Пересборка собирает то, что у вас есть. Следующий шаг - вынести это наружу, чтобы вас нашли',
        href: ROUTES.proyavlennost,
        label: 'Профессиональная проявленность',
      }}
    />
  );
}
