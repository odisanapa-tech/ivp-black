/**
 * Интерфейс приема оплаты. Реализаций может быть несколько, сейчас одна -
 * заглушка. Подключение настоящего эквайринга это добавление второй
 * реализации, а не переписывание кода вокруг.
 */

export type PaymentOrder = {
  orderId: number;
  productId: string;
  /** Сумма в копейках. */
  amount: number;
  email: string;
  name: string | null;
};

export type CreatePaymentResult = {
  /** Куда отправить покупателя после нажатия кнопки. */
  redirectUrl: string;
  /** Идентификатор платежа на стороне провайдера, если он есть. */
  externalId?: string;
};

export type WebhookResult = {
  orderId: number;
  status: 'paid' | 'failed';
  /** Фактически поступившая сумма в копейках. */
  paidAmount: number;
  externalId?: string;
};

export interface PaymentProvider {
  readonly name: string;
  createPayment(order: PaymentOrder): Promise<CreatePaymentResult>;
  handleWebhook(body: unknown, headers: Headers): Promise<WebhookResult>;
}
