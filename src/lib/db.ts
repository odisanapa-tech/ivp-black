import { Pool } from 'pg';

/**
 * Подключение к Postgres. Строка берется только из окружения:
 * в репозитории ее нет и быть не может, репозиторий публичный.
 */
declare global {
  // eslint-disable-next-line no-var
  var __ivpPool: Pool | undefined;
}

function makePool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL не задан: задайте переменную окружения проекта');
  }
  return new Pool({
    connectionString,
    max: 3,
    ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
      ? undefined
      : { rejectUnauthorized: true },
  });
}

/** Пул переживает горячую перезагрузку в разработке. */
export function pool(): Pool {
  if (!global.__ivpPool) global.__ivpPool = makePool();
  return global.__ivpPool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await pool().query(text, params);
  return res.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  const rows = await query<T>(text, params);
  return rows[0];
}

/** Транзакция. Нужна там, где заказ, атрибуция и начисление пишутся вместе. */
export async function transaction<T>(fn: (c: import('pg').PoolClient) => Promise<T>): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
