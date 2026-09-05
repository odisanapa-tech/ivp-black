'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/config/site';
import s from './Filter.module.css';

/**
 * Фильтр "С чего начать". Перенесен из filtr-ivp.html без изменения логики.
 * Меняются только адреса (LINKS) и тексты результатов (RESULT).
 */

/** Адреса продуктов. Берутся из общего конфига, а не пишутся строкой. */
const LINKS: Record<ResultKey, string> = {
  atlas: ROUTES.atlas,
  peresborka: ROUTES.peresborka,
  proyavlennost: ROUTES.proyavlennost,
  formats: ROUTES.formats,
};

type ResultKey = 'atlas' | 'peresborka' | 'proyavlennost' | 'formats';

/** Тексты результатов. Ключ - продукт. */
const RESULT: Record<ResultKey, { title: string; text: string }> = {
  atlas: {
    title: 'Педагогический атлас',
    text: 'Шесть форматов работы, разобранных по восьми осям: кто заказчик, с каким запросом приходят, какая у вас роль, где ваши границы. Плюс оффер к каждому формату - как объяснить ценность тому, кто платит. Начинать стоит отсюда: сначала видно поле целиком, потом уже свое место в нем.',
  },
  peresborka: {
    title: 'Профессиональная пересборка',
    text: 'Две рабочие тетради. Вы собираете свой багаж, достижения и то, что умеете и сами за способность не считаете. Из заполненных тетрадей вынимается ваш метод и то, что из него можно продавать. В тарифе с разбором добавляется встреча и карта рынка вашего города.',
  },
  proyavlennost: {
    title: 'Профессиональная проявленность',
    text: 'Собранное выносится наружу: страница и тексты, в которых вас можно узнать и найти. Это не про сайт под ключ, это про предъявление того, что у вас уже есть.',
  },
  formats: {
    title: 'Форматы под заказ',
    text: 'Работа со студией и командой идет отдельно: разбор под задачу, а не готовый продукт с полки. Здесь начинается разговор, а не покупка.',
  },
};

const STEP_ONE = [
  {
    value: 'solo',
    title: 'Я работаю сама или сам',
    hint: 'Ученики, уроки, может быть небольшая группа. Все держится на мне.',
  },
  {
    value: 'system',
    title: 'У меня студия или команда',
    hint: 'Есть другие педагоги, и работу надо передавать, а не делать одному.',
  },
] as const;

const STEP_TWO: { value: ResultKey; title: string; hint: string }[] = [
  {
    value: 'atlas',
    title: 'Не понимаю, из чего вообще состоит моя работа',
    hint: 'Все называется «уроки вокала», а внутри разное. И объяснить, за что мне платят, я толком не могу.',
  },
  {
    value: 'peresborka',
    title: 'Опыт есть, а собрать его в свое не получается',
    hint: 'Двадцать лет практики, а сказать, в чем мой метод и что я продаю, не выходит.',
  },
  {
    value: 'proyavlennost',
    title: 'Внутри все ясно, а снаружи меня не видно',
    hint: 'Я знаю, что делаю и для кого. Но снаружи этого нет: ни страницы, ни внятных текстов.',
  },
];

export function Filter() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [result, setResult] = useState<ResultKey | null>(null);

  function finish(key: ResultKey) {
    setResult(key);
    setStep(3);
  }

  function chooseFirst(value: (typeof STEP_ONE)[number]['value']) {
    // Студия и команда уходят в форматы под заказ, минуя второй вопрос:
    // продукта под эту аудиторию на витрине пока нет.
    if (value === 'system') {
      finish('formats');
      return;
    }
    setStep(2);
  }

  return (
    <section id="filtr">
      <h2>С чего начать</h2>
      <p className="lead">Два вопроса. В конце - один продукт, а не список из четырех.</p>

      <div className={s.dots} aria-hidden="true">
        <i className={`${s.dot} ${s.dotOn}`} />
        <i className={`${s.dot} ${step !== 1 ? s.dotOn : ''}`} />
      </div>

      {step === 1 && (
        <div>
          <p className={s.q}>Как сейчас устроена ваша работа?</p>
          <div className={s.opts}>
            {STEP_ONE.map((o) => (
              <button key={o.value} className={s.opt} onClick={() => chooseFirst(o.value)}>
                <b>{o.title}</b>
                <span>{o.hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className={s.q}>Что сейчас ближе всего к тому, что вас беспокоит?</p>
          <div className={s.opts}>
            {STEP_TWO.map((o) => (
              <button key={o.value} className={s.opt} onClick={() => finish(o.value)}>
                <b>{o.title}</b>
                <span>{o.hint}</span>
              </button>
            ))}
          </div>
          <button className={s.back} onClick={() => setStep(1)}>
            Назад
          </button>
        </div>
      )}

      {step === 3 && result && (
        <div>
          <div className={s.res}>
            <p className={s.kicker}>Вам сюда</p>
            <h2>{RESULT[result].title}</h2>
            <p>{RESULT[result].text}</p>
            <Link className="cta" href={LINKS[result]}>
              Посмотреть
            </Link>
          </div>
          <button
            className={s.again}
            onClick={() => {
              setResult(null);
              setStep(1);
            }}
          >
            Пройти заново
          </button>
        </div>
      )}
    </section>
  );
}
