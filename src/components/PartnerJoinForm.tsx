'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Consent } from './Consent';

/** Подключение к партнерской программе. */
export function PartnerJoinForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [taxStatus, setTaxStatus] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch('/api/partner/join', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, taxStatus, consent }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setBusy(false);
    if (!res?.ok) {
      setError(data?.error ?? 'Не удалось отправить');
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-lg rounded-lg border border-rule bg-page p-6">
        <p className="text-[17px] text-ink/90">
          Заявка принята. Ссылка для входа в кабинет отправлена на указанную почту.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-lg">
      <Field label="Как к вам обращаться" htmlFor="pj-name">
        <Input id="pj-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>

      <Field label="Почта" htmlFor="pj-email">
        <Input
          id="pj-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>

      <Field label="Налоговый статус: самозанятый, ИП или другое" htmlFor="pj-tax">
        <Input id="pj-tax" value={taxStatus} onChange={(e) => setTaxStatus(e.target.value)} required />
      </Field>

      <Consent checked={consent} onChange={setConsent} id="pj-consent" />

      {error && <p className="mb-4 text-[15px] text-[#8B1D3F]">{error}</p>}

      <Button type="submit" size="lg" disabled={busy}>
        {busy ? 'Минуту...' : 'Подключиться'}
      </Button>
    </form>
  );
}
