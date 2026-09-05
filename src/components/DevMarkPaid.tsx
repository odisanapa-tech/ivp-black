'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';

/**
 * Кнопка "считать оплаченным". Только режим разработки.
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
    <div className="rounded-lg border border-dashed border-bronze/60 bg-bronze/5 p-5 md:p-6 max-w-md">
      <p className="text-[15px] text-ink/80 mb-4">
        <strong>Режим разработки.</strong> Этой плашки на боевом сайте нет.
      </p>
      <Field label="Сумма оплаты, рублей" htmlFor="dev-amount">
        <Input
          id="dev-amount"
          value={rubles}
          onChange={(e) => setRubles(e.target.value)}
          inputMode="numeric"
        />
      </Field>
      {error && <p className="mb-4 text-[15px] text-[#8B1D3F]">{error}</p>}
      <Button onClick={markPaid} disabled={busy}>
        {busy ? 'Минуту...' : 'Считать оплаченным'}
      </Button>
    </div>
  );
}
