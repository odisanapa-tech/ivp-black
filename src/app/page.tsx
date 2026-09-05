import Link from 'next/link';
import { Filter } from '@/components/Filter';
import { LADDER_IDS, formatPrice, getProduct } from '@/config/products';
import { ROUTES } from '@/config/site';

export default function HomePage() {
  return (
    <>
      {/* Блок 1. Первый экран. Слово "институт" в заголовок не выносится. */}
      <section>
        <h1>Вы называете это уроками вокала. А внутри - разные профессии</h1>
        <p className="lead">
          Материалы для вокального педагога: разобраться, из чего на самом деле состоит ваша
          работа, собрать из опыта то, что можно предъявить, и научиться объяснять свою ценность
          тому, кто платит.
        </p>
        <p>
          <Link className="cta" href="#filtr">
            С чего начать
          </Link>
        </p>
      </section>

      {/* Блок 2. Фильтр встроен прямо в страницу, отдельного адреса нет. */}
      <Filter />

      {/* Блок 3. Лестница продуктов. */}
      <section>
        <h2>Что есть</h2>
        {LADDER_IDS.map((id) => {
          const p = getProduct(id);
          if (!p) return null;
          return (
            <div className="box" key={p.id}>
              <h3 style={{ margin: '0 0 8px' }}>
                <Link href={p.href}>{p.title}</Link>
              </h3>
              <p style={{ margin: '0 0 10px' }}>{p.summary}</p>
              <p className="muted" style={{ margin: 0 }}>
                {p.kind === 'lead' ? 'Цена по разговору' : formatPrice(p.price)}
              </p>
            </div>
          );
        })}
      </section>

      {/* Блок 4. Кто ведет. Два абзаца, разделение предметов. */}
      <section>
        <h2>Кто ведет</h2>
        <p>
          <strong>Мария Осадчая</strong> - практикующий психолог, вокальный психолог, наставник
          Музыкальной академии Ларисы Долиной. Больше двадцати лет была вокальным педагогом. Ведет
          все, что касается самой работы с учеником: форматы, роли, границы и то, как устроен
          профессиональный путь педагога.
        </p>
        <p>
          <strong>Дмитрий Осадчий</strong> - 【роль и предмет Дмитрия: чем занимается и что ведет в
          продуктах】. 【один-два предложения о разделении предметов между Марией и Дмитрием】
        </p>
      </section>

      {/* Блок 5. Плашка "Форматы под заказ". */}
      <section>
        <div className="card">
          <h2 style={{ margin: '0 0 12px' }}>Форматы под заказ</h2>
          <p>
            Если у вас студия или команда: разбор под вашу задачу, а не готовый продукт с полки.
            Здесь начинается разговор, а не покупка.
          </p>
          <Link className="cta" href={ROUTES.formats}>
            Посмотреть форматы
          </Link>
        </div>
      </section>
    </>
  );
}
