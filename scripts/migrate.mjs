/**
 * Прогон миграций. Каждый файл из db/migrations выполняется один раз,
 * применение записывается в таблицу migrations.
 *
 * Запуск: npm run db:migrate
 * Строка подключения берется из DATABASE_URL_UNPOOLED (прямое подключение,
 * без пулера) или из DATABASE_URL.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error('Нет строки подключения: задайте DATABASE_URL в .env');
  process.exit(1);
}

const dir = path.join(process.cwd(), 'db', 'migrations');
const client = new pg.Client({ connectionString: url });
await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS migrations (
    name       text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )
`);

const applied = new Set(
  (await client.query('SELECT name FROM migrations')).rows.map((r) => r.name),
);
const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();

for (const file of files) {
  if (applied.has(file)) {
    console.log(`- ${file}: уже применена`);
    continue;
  }
  const sql = await readFile(path.join(dir, file), 'utf8');
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
    await client.query('COMMIT');
    console.log(`+ ${file}: применена`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(`! ${file}: ошибка`, e.message);
    process.exit(1);
  }
}

await client.end();
console.log('Готово.');
