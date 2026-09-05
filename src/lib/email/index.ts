import { query } from '@/lib/db';

/**
 * Отправка писем. Провайдер на этом этапе не подключен, поэтому письма
 * складываются в таблицу emails и видны в админке. Подключение настоящей
 * отправки - вторая реализация этой функции, а не правка вызывающего кода.
 */

export type Letter = {
  to: string;
  subject: string;
  body: string;
};

export async function sendEmail(letter: Letter): Promise<void> {
  await query(
    `INSERT INTO emails (to_email, subject, body, status) VALUES ($1, $2, $3, 'queued')`,
    [letter.to, letter.subject, letter.body],
  );
}
