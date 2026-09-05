'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { NOTEBOOKS, allFields, type FieldVisibility } from '@/config/notebooks';

/**
 * Демонстрация кабинета педагога.
 *
 * Данные живут только в sessionStorage браузера: между сессиями не
 * сохраняются и на сервер не уходят. Это демонстрация идеи, а не продукт.
 *
 * Главное, что она должна показать, - не форму, а разделение: видимость
 * управляется на уровне отдельного поля, а не тетради целиком.
 */

type Answers = Record<string, { value: string; visibility: FieldVisibility }>;

const STORAGE_KEY = 'ivp_demo_kabinet';
const SCREENS = [
  { key: 'notebooks', label: 'Тетради' },
  { key: 'profile', label: 'Что собралось в профиль' },
  { key: 'preview', label: 'Предпросмотр профиля' },
] as const;

type ScreenKey = (typeof SCREENS)[number]['key'];

export function CabinetDemo() {
  const [screen, setScreen] = useState<ScreenKey>('notebooks');
  const [answers, setAnswers] = useState<Answers>({});
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const notebook = NOTEBOOKS[0];
  const fields = allFields(notebook);

  // Восстановление из sessionStorage: демонстрация переживает переход
  // между экранами, но не переживает закрытие вкладки.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers(JSON.parse(raw) as Answers);
    } catch {
      // Приватный режим браузера: демонстрация начнется с чистого листа.
    }
    setLoaded(true);
  }, []);

  // Автосохранение по ходу.
  useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 1500);
      return () => clearTimeout(t);
    } catch {
      return;
    }
  }, [answers, loaded]);

  function setValue(fieldId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      // По умолчанию видимость - только для себя.
      [fieldId]: { value, visibility: prev[fieldId]?.visibility ?? 'private' },
    }));
  }

  function toggleVisibility(fieldId: string) {
    setAnswers((prev) => {
      const current = prev[fieldId] ?? { value: '', visibility: 'private' as FieldVisibility };
      return {
        ...prev,
        [fieldId]: {
          ...current,
          visibility: current.visibility === 'public' ? 'private' : 'public',
        },
      };
    });
  }

  const filled = fields.filter((f) => (answers[f.id]?.value ?? '').trim().length > 0);
  const publicFields = fields.filter(
    (f) => !f.neverPublic && answers[f.id]?.visibility === 'public' && answers[f.id]?.value?.trim(),
  );
  const progress = fields.length ? Math.round((filled.length / fields.length) * 100) : 0;

  return (
    <div>
      <nav className="flex flex-wrap gap-2 mb-10">
        {SCREENS.map((s) => (
          <button
            key={s.key}
            onClick={() => setScreen(s.key)}
            className={cn(
              'rounded-md px-4 py-2.5 text-[15px] transition-colors border',
              screen === s.key
                ? 'bg-accent text-white border-accent'
                : 'bg-page text-ink border-rule hover:border-accent hover:text-accent',
            )}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {screen === 'notebooks' && (
        <div>
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            {NOTEBOOKS.map((n) => {
              const isOpen = n.id === notebook.id;
              return (
                <Card key={n.id} className={cn('bg-page', !n.available && 'opacity-60')}>
                  <div className="p-5">
                    <h3 className="font-display text-[17px] font-medium text-ink leading-snug">
                      {n.title}
                    </h3>
                    <p className="mt-2 text-[14px] text-muted leading-relaxed">{n.subtitle}</p>
                    <div className="mt-4">
                      {n.available ? (
                        <>
                          <div className="h-1.5 rounded-sm bg-rule/60 overflow-hidden">
                            <div
                              className="h-full bg-accent transition-all"
                              style={{ width: `${isOpen ? progress : 0}%` }}
                            />
                          </div>
                          <p className="mt-2 text-[13px] text-muted">
                            Заполнено {isOpen ? filled.length : 0} из {fields.length}
                          </p>
                        </>
                      ) : (
                        <Badge variant="planned">Откроется позже</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex items-baseline justify-between gap-4 mb-6 flex-wrap">
            <h2 className="font-display text-[24px] md:text-[28px] text-ink">{notebook.title}</h2>
            <span
              className={cn(
                'text-[14px] transition-opacity',
                saved ? 'text-accent opacity-100' : 'text-muted opacity-0',
              )}
            >
              Сохранено
            </span>
          </div>

          {notebook.sections.map((section) => (
            <section key={section.id} className="mb-10">
              <h3 className="font-display text-[19px] text-ink mb-5">{section.title}</h3>

              <div className="flex flex-col gap-6">
                {section.fields.map((field) => {
                  const state = answers[field.id];
                  const isPublic = state?.visibility === 'public';
                  return (
                    <div key={field.id} className="rounded-lg border border-rule bg-page p-5 md:p-6">
                      <label
                        htmlFor={`f-${field.id}`}
                        className="block font-medium text-[16px] text-ink mb-1.5"
                      >
                        {field.question}
                      </label>
                      {field.hint && (
                        <p className="text-[14px] text-muted leading-relaxed mb-3">{field.hint}</p>
                      )}

                      <Textarea
                        id={`f-${field.id}`}
                        rows={3}
                        value={state?.value ?? ''}
                        onChange={(e) => setValue(field.id, e.target.value)}
                        placeholder="Своими словами"
                      />

                      <div className="mt-3">
                        {field.neverPublic ? (
                          <span className="inline-flex items-center gap-2 text-[14px] text-muted">
                            <Lock className="h-4 w-4" />
                            Только для себя. Это поле наружу не выносится
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleVisibility(field.id)}
                            data-visibility-for={field.id}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[14px] transition-colors',
                              isPublic
                                ? 'border-accent text-accent bg-accent-soft/50'
                                : 'border-rule text-muted hover:border-accent hover:text-accent',
                            )}
                            aria-pressed={isPublic}
                          >
                            {isPublic ? (
                              <>
                                <Eye className="h-4 w-4" />
                                Видно в публичном профиле
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4" />
                                Только для себя
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {screen === 'profile' && (
        <div>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-3">
            Что собралось в профиль
          </h2>
          <p className="text-[16px] text-muted leading-relaxed mb-8 max-w-2xl">
            Слева то, что вы написали. Справа - выносится это наружу или нет. Решение принимается
            по каждому полю отдельно, а не по тетради целиком.
          </p>

          {filled.length === 0 ? (
            <p className="text-[16px] text-muted">
              Пока ничего не заполнено. Вернитесь на экран «Тетради» и напишите хоть одно поле.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {fields.map((field) => {
                const state = answers[field.id];
                if (!state?.value?.trim()) return null;
                const isPublic = !field.neverPublic && state.visibility === 'public';
                return (
                  <div
                    key={field.id}
                    className="rounded-lg border border-rule bg-page p-5 flex flex-col md:flex-row md:items-start gap-3 md:gap-6"
                  >
                    <div className="flex-1">
                      <p className="text-[14px] text-muted mb-1">{field.question}</p>
                      <p className="text-[16px] text-ink/90 leading-relaxed whitespace-pre-wrap">
                        {state.value}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {field.neverPublic ? (
                        <Badge variant="muted">Никогда не наружу</Badge>
                      ) : isPublic ? (
                        <Badge variant="default">В профиле</Badge>
                      ) : (
                        <Badge variant="outline">Только для себя</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {screen === 'preview' && (
        <div>
          <h2 className="font-display text-[24px] md:text-[28px] text-ink mb-3">
            Предпросмотр публичного профиля
          </h2>
          <p className="text-[16px] text-muted leading-relaxed mb-8 max-w-2xl">
            Так профиль видит ученик или родитель. Здесь только те поля, которые вы отметили как
            публичные. Все остальное осталось в тетради.
          </p>

          {publicFields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-rule bg-card/60 p-6 text-[16px] text-muted">
              Публичных полей пока нет, поэтому снаружи профиль пустой. Так и должно быть: по
              умолчанию наружу не выносится ничего.
            </div>
          ) : (
            <Card className="max-w-xl bg-page">
              <div className="p-6 md:p-7">
                <Badge variant="planned">Предпросмотр</Badge>
                <h3 className="mt-4 font-display text-[22px] font-medium text-ink">
                  Ваше имя появится здесь
                </h3>
                <dl className="mt-5 space-y-4">
                  {publicFields.map((f) => (
                    <div key={f.id}>
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted/80">
                        {f.profileLabel ?? f.question}
                      </dt>
                      <dd className="mt-1 text-[16px] text-ink/90 leading-relaxed whitespace-pre-wrap">
                        {answers[f.id]?.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-[14px] text-muted">
                  Профиль публикуется только после отдельного согласия педагога.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
