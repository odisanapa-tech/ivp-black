'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';

/**
 * Админка защищена одним токеном из переменной окружения ADMIN_TOKEN.
 * Ролей и учетных записей на этом этапе нет.
 *
 * РЕШЕНИЕ ПРИНЯТО ЗА ЗАКАЗЧИКА: админки в ТЗ нет, но без нее нельзя
 * выполнить требование раздела 6 - переводить начисление в "к выплате"
 * вручную.
 */
function assertToken(token: string) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) throw new Error('Нет доступа');
}

export async function setAccrualStatus(formData: FormData) {
  assertToken(String(formData.get('token') ?? ''));
  const id = Number(formData.get('id'));
  const status = String(formData.get('status'));
  if (!['pending_confirmation', 'payable', 'paid', 'cancelled'].includes(status)) {
    throw new Error('Неизвестный статус');
  }
  await query(
    `UPDATE accruals
        SET status = $2,
            paid_at = CASE WHEN $2 = 'paid' THEN now() ELSE paid_at END
      WHERE id = $1`,
    [id, status],
  );
  revalidatePath('/admin');
}

export async function completeOrder(formData: FormData) {
  assertToken(String(formData.get('token') ?? ''));
  const id = Number(formData.get('id'));
  await query(
    `UPDATE orders SET status = 'completed', completed_at = now()
      WHERE id = $1 AND status = 'paid'`,
    [id],
  );
  revalidatePath('/admin');
}

export async function setPartnerStatus(formData: FormData) {
  assertToken(String(formData.get('token') ?? ''));
  const id = Number(formData.get('id'));
  const status = String(formData.get('status'));
  if (!['pending', 'active', 'suspended'].includes(status)) throw new Error('Неизвестный статус');
  await query('UPDATE partners SET status = $2 WHERE id = $1', [id, status]);
  revalidatePath('/admin');
}
