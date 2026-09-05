'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { formatPrice, type Product } from '@/config/products';
import { cn } from '@/lib/cn';
import { Consent } from './Consent';

/**
 * Покупка. Полей минимум: почта плюс имя. Плюс отдельная галочка согласия.
 * Если у продукта два варианта, они выбираются здесь же.
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
    <form onSubmit={submit} className="max-w-lg">
      {products.length > 1 && (
        <div className="mb-6 flex flex-col gap-3">
          {products.map((p) => (
            <label
              key={p.id}
              htmlFor={`tier-${p.id}`}
              className={cn(
                'flex gap-3 items-start rounded-lg border px-5 py-4 cursor-pointer transition-colors bg-page',
                productId === p.id ? 'border-accent' : 'border-rule hover:border-accent/60',
              )}
            >
              <input
                id={`tier-${p.id}`}
                type="radio"
                name="tier"
                checked={productId === p.id}
                onChange={() => setProductId(p.id)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#6E4C7A]"
              />
              <span>
                <span className="block font-medium text-ink">{p.title}</span>
                <span className="block text-[15px] text-muted mt-0.5">{formatPrice(p.price)}</span>
              </span>
            </label>
          ))}
        </div>
      )}

      <Field label="Как к вам обращаться" htmlFor="buy-name">
        <Input id="buy-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
      </Field>

      <Field label="Почта, на нее придет файл" htmlFor="buy-email">
        <Input
          id="buy-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </Field>

      <Consent checked={consent} onChange={setConsent} id="buy-consent" />

      {error && <p className="mb-4 text-[15px] text-[#8B1D3F]">{error}</p>}

      <Button type="submit" size="lg" disabled={busy}>
        {busy ? 'Минуту...' : cta}
      </Button>
    </form>
  );
}
