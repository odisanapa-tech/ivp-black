/**
 * Собирает все миграции в один файл db/neon-console.sql, который заказчик
 * копирует целиком в SQL Editor консоли Neon.
 *
 * Файл идемпотентный: повторный запуск ничего не ломает. В конце
 * проставляются отметки в таблице migrations, чтобы npm run db:migrate
 * потом не пытался применить то же самое второй раз.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dir = path.join(process.cwd(), 'db', 'migrations');
const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();

const parts = [
  '-- Схема базы сайта ИВП, одним файлом.',
  '-- Скопируйте целиком и выполните в SQL Editor консоли Neon.',
  '-- Повторный запуск безопасен: все шаги идемпотентны.',
  '',
  'CREATE TABLE IF NOT EXISTS migrations (',
  '  name       text PRIMARY KEY,',
  '  applied_at timestamptz NOT NULL DEFAULT now()',
  ');',
  '',
];

for (const file of files) {
  const sql = (await readFile(path.join(dir, file), 'utf8')).trim();
  parts.push(`-- ${'='.repeat(70)}`, `-- ${file}`, `-- ${'='.repeat(70)}`, '', sql, '');
}

parts.push(
  `-- ${'='.repeat(70)}`,
  '-- Отметки о применении, чтобы npm run db:migrate не повторял эти шаги',
  `-- ${'='.repeat(70)}`,
  '',
  'INSERT INTO migrations (name) VALUES',
  files.map((f) => `  ('${f}')`).join(',\n'),
  'ON CONFLICT (name) DO NOTHING;',
  '',
);

await writeFile(path.join(process.cwd(), 'db', 'neon-console.sql'), parts.join('\n'), 'utf8');
console.log(`db/neon-console.sql собран из ${files.length} миграций`);
