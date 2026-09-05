-- Схема базы сайта ИВП, одним файлом.
-- Скопируйте целиком и выполните в SQL Editor консоли Neon.
-- Повторный запуск безопасен: все шаги идемпотентны.

CREATE TABLE IF NOT EXISTS migrations (
  name       text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

-- ======================================================================
-- 001_init.sql
-- ======================================================================

-- Первая очередь сайта ИВП. Минимальная модель из раздела 5 ТЗ.
--
-- Денежные суммы везде целые, в копейках: с числами с плавающей точкой
-- деньги считать нельзя.

-- Пользователи. Учетная запись заводится автоматически при первой покупке,
-- по email. Пароля на этом этапе нет.
CREATE TABLE IF NOT EXISTS users (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text        NOT NULL,
  name        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
-- Email - фактический ключ пользователя, дубли недопустимы.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (lower(email));

-- Продукты. Идентификатор строковый и постоянный: он уходит в заказы,
-- начисления и партнерские ссылки, после первой продажи не меняется.
-- price - в копейках, NULL означает "цена еще не назначена".
CREATE TABLE IF NOT EXISTS products (
  id          text PRIMARY KEY,
  title       text        NOT NULL,
  price       bigint,
  type        text        NOT NULL CHECK (type IN ('file', 'lead')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Заказы.
-- status: pending - создан, оплата не подтверждена
--         paid    - деньги получены, продукт выдан
--         completed - продукт завершен, с этого момента начисление можно
--                     переводить в "к выплате"
CREATE TABLE IF NOT EXISTS orders (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       bigint      NOT NULL REFERENCES users (id),
  product_id    text        NOT NULL REFERENCES products (id),
  amount        bigint      NOT NULL DEFAULT 0,
  status        text        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'paid', 'completed', 'cancelled')),
  paid_at       timestamptz,
  completed_at  timestamptz,
  -- Ссылка на скачивание живет не меньше 30 дней: платят с телефона,
  -- а открывают с компьютера.
  download_token       text UNIQUE,
  download_expires_at  timestamptz,
  -- Партнерский код, снятый с cookie в момент оформления заказа.
  -- Хранится здесь, а не читается из cookie при подтверждении оплаты:
  -- уведомление эквайринга приходит от платежной системы, в нем браузера
  -- покупателя нет и cookie взять неоткуда.
  ref_code             text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id);

-- Партнеры.
CREATE TABLE IF NOT EXISTS partners (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id         bigint      NOT NULL UNIQUE REFERENCES users (id),
  code            text        NOT NULL UNIQUE,
  status          text        NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'active', 'suspended')),
  payout_details  text,
  tax_status      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Атрибуция: закрепление покупателя за партнером.
--
-- Правило: первый партнер, по ссылке которого пришел человек, закреплен за ним
-- навсегда. Переход по ссылке другого партнера позже закрепление НЕ меняет.
-- Одна строка на пользователя, поэтому user_id - первичный ключ.
CREATE TABLE IF NOT EXISTS attributions (
  user_id        bigint      PRIMARY KEY REFERENCES users (id),
  partner_id     bigint      NOT NULL REFERENCES partners (id),
  first_seen_at  timestamptz NOT NULL DEFAULT now(),
  locked         boolean     NOT NULL DEFAULT true
);

-- Закрепление защищено на уровне базы, а не только на уровне кода:
-- ошибка в приложении не должна уметь переписать связку задним числом.
CREATE OR REPLACE FUNCTION attributions_locked_guard() RETURNS trigger AS $$
BEGIN
  IF OLD.locked THEN
    RAISE EXCEPTION
      'Закрепление ученика за партнером изменить нельзя: attributions.user_id=%',
      OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS attributions_no_update ON attributions;
CREATE TRIGGER attributions_no_update
  BEFORE UPDATE OR DELETE ON attributions
  FOR EACH ROW EXECUTE FUNCTION attributions_locked_guard();

-- Начисления партнеру.
-- rate хранится вместе с начислением: ставка в конфиге может поменяться,
-- а уже посчитанное вознаграждение должно остаться проверяемым.
-- status: pending_confirmation - "ожидает подтверждения" (при создании)
--         payable              - "к выплате" (вручную из админки)
--         paid                 - выплачено
CREATE TABLE IF NOT EXISTS accruals (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id    bigint      NOT NULL UNIQUE REFERENCES orders (id),
  partner_id  bigint      NOT NULL REFERENCES partners (id),
  rate        numeric(5,4) NOT NULL,
  amount      bigint      NOT NULL,
  status      text        NOT NULL DEFAULT 'pending_confirmation'
              CHECK (status IN ('pending_confirmation', 'payable', 'paid', 'cancelled')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  paid_at     timestamptz
);
CREATE INDEX IF NOT EXISTS accruals_partner_idx ON accruals (partner_id, status);

-- Переходы по партнерской ссылке. Нужны для экрана "Переходы" в кабинете.
-- Личных данных не хранится: visitor_hash - соль плюс адрес и агент,
-- нужен только чтобы не считать один и тот же заход дважды.
CREATE TABLE IF NOT EXISTS ref_visits (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  partner_id   bigint      NOT NULL REFERENCES partners (id),
  path         text        NOT NULL,
  visitor_hash text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ref_visits_partner_idx ON ref_visits (partner_id, created_at);

-- Заявки с /proyavlennost и /formats. Оплаты там нет, но заявку надо
-- где-то хранить: почта может не дойти, а заявка - это деньги.
CREATE TABLE IF NOT EXISTS leads (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  text        REFERENCES products (id),
  name        text        NOT NULL,
  contact     text        NOT NULL,
  comment     text,
  ref_code    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Исходящие письма. На этом этапе настоящей отправки нет, письма копятся
-- здесь и видны в админке. Подключение провайдера - вторая реализация
-- адаптера, а не переписывание.
CREATE TABLE IF NOT EXISTS emails (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  to_email    text        NOT NULL,
  subject     text        NOT NULL,
  body        text        NOT NULL,
  status      text        NOT NULL DEFAULT 'queued'
              CHECK (status IN ('queued', 'sent', 'failed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Одноразовые ссылки входа в партнерский кабинет. Пароля нет,
-- вход по ссылке из письма.
CREATE TABLE IF NOT EXISTS partner_login_tokens (
  token       text PRIMARY KEY,
  partner_id  bigint      NOT NULL REFERENCES partners (id),
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Вторая очередь (раздел 10 ТЗ) сюда добавляется таблицами
-- answers(user_id, notebook_id, field_id, value, visibility) без изменения
-- существующих: флаг видимости живет на уровне поля, а не тетради.

-- ======================================================================
-- 002_products.sql
-- ======================================================================

-- Витрина. Идентификаторы совпадают с src/config/products.ts и постоянны.
-- Цены заказчиком не назначены, поэтому price = NULL: выдуманных чисел в базе
-- нет так же, как и на страницах.
INSERT INTO products (id, title, price, type) VALUES
  ('atlas',              'Педагогический атлас',                        NULL, 'file'),
  ('peresborka-base',    'Профессиональная пересборка',                 NULL, 'file'),
  ('peresborka-razbor',  'Профессиональная пересборка, с разбором',     NULL, 'file'),
  ('proyavlennost',      'Профессиональная проявленность',              NULL, 'lead'),
  ('formats',            'Форматы под заказ',                           NULL, 'lead')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

-- ======================================================================
-- 003_products_v2_profiles.sql
-- ======================================================================

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

-- ======================================================================
-- Отметки о применении, чтобы npm run db:migrate не повторял эти шаги
-- ======================================================================

INSERT INTO migrations (name) VALUES
  ('001_init.sql'),
  ('002_products.sql'),
  ('003_products_v2_profiles.sql')
ON CONFLICT (name) DO NOTHING;
