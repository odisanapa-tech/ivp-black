import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/PageHeader';
import { Notice } from '@/components/ui/section';
import { CONTACTS, SITE_NAME } from '@/config/site';
import { PARTNER } from '@/config/partner';

export const metadata: Metadata = { title: 'Политика обработки персональных данных' };

/**
 * ЧЕРНОВИК. Готовый текст заказчиком не передан.
 * Юридической проверки не проходил, пропуски видны в 【скобках】.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader kicker="Документы" title="Политика обработки персональных данных" />
      <div className="container-prose pb-20 md:pb-28 prose-ivp">
        <div className="mb-8 not-prose">
          <Notice tone="draft">
            Черновик. Текст написан как рабочая основа и юридической проверки не проходил. Пропуски
            в【скобках】заполняет заказчик.
          </Notice>
        </div>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">1. Кто обрабатывает данные</h2>
      <p>
        Оператор: {CONTACTS.legalEntity}, ИНН {CONTACTS.inn}, {CONTACTS.legalAddress}. Сайт:{' '}
        {SITE_NAME}. Связаться по вопросам обработки данных: {CONTACTS.publicEmail}.
      </p>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">2. Какие данные мы собираем</h2>
      <ul>
        <li>Имя, которое вы указываете сами в форме покупки или заявки.</li>
        <li>Адрес электронной почты или другой контакт, который вы оставляете.</li>
        <li>Комментарий к заявке, если вы его написали.</li>
        <li>Сведения о заказах: какой продукт, когда, на какую сумму.</li>
        <li>
          Технические данные: партнерский код из ссылки, по которой вы пришли, он хранится в файле
          cookie {PARTNER.cookieDays} дней.
        </li>
      </ul>
      <p>
        Мы не собираем специальные категории персональных данных и не просим сведения о здоровье,
        вероисповедании и подобное.
      </p>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">3. Зачем мы их обрабатываем</h2>
      <ul>
        <li>Чтобы передать вам купленный материал и написать по вашей заявке.</li>
        <li>Чтобы вести учет заказов.</li>
        <li>Чтобы посчитать вознаграждение партнера, по ссылке которого вы пришли.</li>
      </ul>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">4. На каком основании</h2>
      <p>
        На основании вашего согласия, которое вы даете отдельной галочкой в форме. Согласие можно
        отозвать в любой момент, написав на {CONTACTS.publicEmail}.
      </p>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">5. Сколько мы их храним</h2>
      <p>
        Данные о заказах храним 【срок хранения】. Данные из заявок, которые не привели к работе,
        храним 【срок хранения】, после чего удаляем.
      </p>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">6. Кому передаем</h2>
      <p>
        Третьим лицам данные не передаются, кроме случаев, когда это нужно для исполнения договора
        с вами: 【список: платежный сервис, сервис почтовых рассылок, хостинг】.
      </p>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">7. Ваши права</h2>
      <p>
        Вы можете запросить, какие ваши данные у нас есть, потребовать их исправить или удалить, а
        также отозвать согласие. Мы отвечаем на такие обращения в течение 【срок ответа】 с момента
        получения письма на {CONTACTS.publicEmail}.
      </p>

      <h2 className="font-display text-[22px] md:text-[25px] text-ink mt-10 mb-4">8. Файлы cookie</h2>
      <p>
        Сайт использует cookie только для одной задачи: запомнить партнерский код из ссылки, по
        которой вы пришли. Рекламных и аналитических cookie на сайте нет.
      </p>
      </div>
    </>
  );
}
