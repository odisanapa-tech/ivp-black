import { ROUTES } from '@/config/site';
import type { CreatePaymentResult, PaymentOrder, PaymentProvider, WebhookResult } from './types';

/**
 * Заглушка вместо эквайринга. Настоящих денег на этом этапе нет:
 * кнопка ведет на страницу "здесь будет оплата".
 *
 * Чек по 54-ФЗ - задача эквайринга, здесь не делается.
 */
export const stubProvider: PaymentProvider = {
  name: 'stub',

  async createPayment(order: PaymentOrder): Promise<CreatePaymentResult> {
    return { redirectUrl: `${ROUTES.payment}?order=${order.orderId}` };
  },

  async handleWebhook(body: unknown): Promise<WebhookResult> {
    // У заглушки нет внешнего источника событий. Оплата подтверждается
    // кнопкой "считать оплаченным", доступной только в режиме разработки.
    const data = (body ?? {}) as { orderId?: number; paidAmount?: number };
    if (!data.orderId) throw new Error('В теле нет orderId');
    return { orderId: Number(data.orderId), status: 'paid', paidAmount: Number(data.paidAmount ?? 0) };
  },
};
