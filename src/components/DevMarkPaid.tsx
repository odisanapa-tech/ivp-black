'use client';

import { useState } from 'react';

/**
 * Кнопка "считать оплаченным". Только режим разработки.
 * Настоящих денег на этом этапе нет, а сценарий с партнерской меткой,
 * закреплением и начислением проверить надо.
 *
 * Сумма вводится руками: цены продуктов заказчиком не назначены, поэтому
 * в заказе лежит ноль, а на нуле не видно, правильно ли посчиталось
 * вознаграждение партнера.
 */
export function DevMarkPaid({ orderId }: { orderId: number }) {
  const [rubles, setRubles] = useState('3000');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function markPaid() {
    setBusy(true);
    setError(null);
    const res = await fetch('/api/dev/mark-paid', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderId, amount: Math.round(Number(rubles) * 100) }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok) {
      setError(data?.error ?? 'Не получилось');
      setBusy(false);
      return;
    }
    window.location.href = '/spasibo?order=' + orderId;
  }

  return (
    <div className="dev-note">
      <p style={{ marginTop: 0 }}>
        <strong>Режим разработки.</strong> Этой плашки на боевом сайте нет.
      </p>
      <label className="field" htmlFor="dev-amount">
        <span>Сумма оплаты, рублей</span>
        <input
          id="dev-amount"
          value={rubles}
          onChange={(e) => setRubles(e.target.value)}
          inputMode="numeric"
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="cta" onClick={markPaid} disabled={busy}>
        {busy ? 'Минуту...' : 'Считать оплаченным'}
      </button>
    </div>
  );
}
