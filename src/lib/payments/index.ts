import { stubProvider } from './stub';
import type { PaymentProvider } from './types';

/**
 * Выбор реализации приема оплаты. Пока она одна.
 * Когда появится эквайринг, здесь добавится ветка по переменной окружения.
 */
export function paymentProvider(): PaymentProvider {
  return stubProvider;
}

export type * from './types';
