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
