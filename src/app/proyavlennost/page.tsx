import type { Metadata } from 'next';
import { LeadForm } from '@/components/LeadForm';

export const metadata: Metadata = { title: 'Профессиональная проявленность' };

export default function ProyavlennostPage() {
  return (
    <article>
      <h1>Профессиональная проявленность</h1>

      <p className="lead">
        Собранное выносится наружу: страница и тексты, в которых вас можно узнать и найти. Это не
        про сайт под ключ, это про предъявление того, что у вас уже есть.
      </p>

      <h2>Что внутри</h2>
      <p>【что внутри: текст заказчика】</p>

      <h2>Что на выходе</h2>
      <p>【что на выходе: текст заказчика】</p>

      <h2>Оставить заявку</h2>
      <p>Работа идет в разговоре, поэтому вместо кнопки оплаты - заявка.</p>
      <LeadForm productId="proyavlennost" cta="Оставить заявку" />
    </article>
  );
}
