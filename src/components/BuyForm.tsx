'use client';

import { useState } from 'react';
import { formatPrice, type Product } from '@/config/products';
import { Consent } from './Consent';

/**
 * Покупка. Полей минимум: почта плюс имя. Плюс отдельная галочка согласия.
 * Если у продукта два тира, они выбираются здесь же.
 */
export function BuyForm({ products, cta }: { products: Product[]; cta: string }) {
  const [productId, setProductId] = useState(products[0].id);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId, email, name, consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Что-то пошло не так');
        setBusy(false);
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setError('Не удалось отправить. Попробуйте еще раз');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      {products.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          {products.map((p) => (
            <label key={p.id} className="consent" htmlFor={`tier-${p.id}`}>
              <input
                id={`tier-${p.id}`}
                type="radio"
                name="tier"
                checked={productId === p.id}
                onChange={() => setProductId(p.id)}
              />
              <span>
                <strong>{p.title}</strong>
                <br />
                {formatPrice(p.price)}
              </span>
            </label>
          ))}
        </div>
      )}

      <label className="field" htmlFor="buy-name">
        <span>Как к вам обращаться</span>
        <input
          id="buy-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
      </label>

      <label className="field" htmlFor="buy-email">
        <span>Почта, на нее придет файл</span>
        <input
          id="buy-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <Consent checked={consent} onChange={setConsent} id="buy-consent" />

      {error && <p className="form-error">{error}</p>}

      <button className="cta" type="submit" disabled={busy}>
        {busy ? 'Минуту...' : cta}
      </button>
    </form>
  );
}
