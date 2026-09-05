/**
 * Партнерская программа. Ставки и сроки собраны здесь и нигде не хардкодятся.
 */

export const PARTNER = {
  /** Ставка с первой покупки закрепленного ученика, доля от базы расчета. */
  firstPurchaseRate: 0.2,
  /** Ставка со всех последующих покупок, пожизненно. */
  repeatPurchaseRate: 0.1,
  /** Сколько живет cookie с партнерским кодом, дней. */
  cookieDays: 180,
  /** Имя cookie с кодом партнера. */
  cookieName: 'ivp_ref',
  /** Имя параметра в ссылке: /atlas?ref=КОД */
  queryParam: 'ref',
  /** Сколько живет ссылка входа в кабинет из письма, часов. */
  loginLinkHours: 72,
} as const;

/** Ставка для начисления: первая покупка ученика или последующая. */
export function commissionRate(isFirstPurchase: boolean): number {
  return isFirstPurchase ? PARTNER.firstPurchaseRate : PARTNER.repeatPurchaseRate;
}

/**
 * Вычитается ли комиссия эквайринга из базы расчета.
 * РЕШЕНИЕ ЗАКАЗЧИКА НЕ ПРИНЯТО. Пока эквайринга нет, вопрос не проявляется,
 * поэтому формула не размазана по коду, а собрана в одну функцию ниже:
 * когда ответ появится, правка ровно в одном месте.
 */
const DEDUCT_ACQUIRING_FEE = false;

/**
 * База расчета вознаграждения - фактически поступившая сумма после скидок.
 * Все суммы в копейках, целыми числами.
 */
export function commissionBase(paidAmount: number, acquiringFee = 0): number {
  return DEDUCT_ACQUIRING_FEE ? paidAmount - acquiringFee : paidAmount;
}

/** Сумма начисления в копейках, округление вниз до копейки. */
export function accrualAmount(
  paidAmount: number,
  isFirstPurchase: boolean,
  acquiringFee = 0,
): number {
  return Math.floor(commissionBase(paidAmount, acquiringFee) * commissionRate(isFirstPurchase));
}
