'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/config/site';

/**
 * Фильтр "Что вам подойдет". Логика перенесена из filtr-ivp.html без
 * изменений, оформление - из дизайн-системы старого сайта.
 * Меняются только адреса (LINKS) и тексты результатов (RESULT).
 */

type ResultKey = 'atlas' | 'peresborka' | 'proyavlennost' | 'formats';

/** Адреса продуктов. Берутся из общего конфига, а не пишутся строкой. */
const LINKS: Record<ResultKey, string> = {
  atlas: ROUTES.atlas,
  peresborka: ROUTES.peresborka,
  proyavlennost: ROUTES.proyavlennost,
  formats: ROUTES.formats,
};

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
    title: 'Страница и тексты',
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

function Option({
  title,
  hint,
  onClick,
}: {
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-page rounded-lg border border-rule px-5 py-4 md:px-6 md:py-5 transition-colors hover:border-accent hover:bg-accent-soft/40"
    >
      <span className="block font-display text-[17px] md:text-[18px] font-medium text-ink mb-1">
        {title}
      </span>
      <span className="block text-[15px] text-muted leading-relaxed">{hint}</span>
    </button>
  );
}

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
    <div>
      <div className="flex gap-2 mb-7" aria-hidden>
        <i className="h-1 w-7 rounded-sm bg-accent" />
        <i className={cn('h-1 w-7 rounded-sm', step !== 1 ? 'bg-accent' : 'bg-rule')} />
      </div>

      {step === 1 && (
        <div>
          <p className="font-display text-[20px] md:text-[22px] font-medium text-ink mb-5">
            Как сейчас устроена ваша работа?
          </p>
          <div className="flex flex-col gap-3">
            {STEP_ONE.map((o) => (
              <Option key={o.value} title={o.title} hint={o.hint} onClick={() => chooseFirst(o.value)} />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="font-display text-[20px] md:text-[22px] font-medium text-ink mb-5">
            Что сейчас ближе всего к тому, что вас беспокоит?
          </p>
          <div className="flex flex-col gap-3">
            {STEP_TWO.map((o) => (
              <Option key={o.value} title={o.title} hint={o.hint} onClick={() => finish(o.value)} />
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-5 text-[15px] text-muted underline underline-offset-4 hover:text-accent"
          >
            Назад
          </button>
        </div>
      )}

      {step === 3 && result && (
        <div>
          <div className="bg-page rounded-lg border-l-4 border border-rule border-l-accent p-6 md:p-7">
            <div className="kicker mb-3">Вам сюда</div>
            <h3 className="font-display text-[22px] md:text-[25px] text-ink mb-3">
              {RESULT[result].title}
            </h3>
            <p className="text-[16px] text-muted leading-relaxed mb-6">{RESULT[result].text}</p>
            <Button asChild>
              <Link href={LINKS[result]}>
                Посмотреть
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <button
            onClick={() => {
              setResult(null);
              setStep(1);
            }}
            className="mt-5 text-[15px] text-muted underline underline-offset-4 hover:text-accent"
          >
            Пройти заново
          </button>
        </div>
      )}
    </div>
  );
}
