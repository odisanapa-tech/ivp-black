-- Редакция 2 ТЗ: два новых продукта Марии, переименование проявленности
-- и модель профилей педагогов.

-- Витрина. Идентификаторы постоянные, менять после первой продажи нельзя.
INSERT INTO products (id, title, price, type) VALUES
  ('golos-snaruzhi', 'Ваш голос снаружи',              NULL, 'file'),
  ('obnovlenie',     'Профессиональное обновление',    NULL, 'lead')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

-- Заголовок продукта сменился: "Профессиональная проявленность" - рабочее
-- слово, посетитель его не присвоит. Идентификатор при этом прежний,
-- иначе порвутся уже оформленные заказы и начисления.
UPDATE products SET title = 'Страница и тексты' WHERE id = 'proyavlennost';

-- Профили педагогов (раздел 8 ТЗ).
--
-- status: draft           - педагог заполняет
--         awaiting_consent - готов, но согласия на публикацию еще нет
--         published        - виден в разделе /pedagogi
--
-- Публикация настоящего профиля требует отдельного согласия педагога на
-- распространение персональных данных, поэтому статус хранится явно,
-- а не выводится из заполненности.
CREATE TABLE IF NOT EXISTS profiles (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      bigint      NOT NULL UNIQUE REFERENCES users (id),
  display_name text,
  city         text,
  formats      text,
  works_with   text,
  method       text,
  contact      text,
  status       text        NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'awaiting_consent', 'published')),
  consent_at   timestamptz,
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON profiles (status);

-- Ответы в тетрадях.
--
-- Видимость живет на уровне ОТДЕЛЬНОГО ПОЛЯ, а не тетради целиком:
-- в тетрадях человек пишет про провалы, про деньги и про страх назвать цену,
-- и наружу это не выносится никогда. По умолчанию поле приватное.
CREATE TABLE IF NOT EXISTS notebook_answers (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     bigint      NOT NULL REFERENCES users (id),
  notebook_id text        NOT NULL,
  section_id  text        NOT NULL,
  field_id    text        NOT NULL,
  value       text,
  visibility  text        NOT NULL DEFAULT 'private'
              CHECK (visibility IN ('private', 'public')),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, notebook_id, field_id)
);
CREATE INDEX IF NOT EXISTS notebook_answers_user_idx ON notebook_answers (user_id, notebook_id);
