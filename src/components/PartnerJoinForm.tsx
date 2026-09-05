'use client';

import { useState } from 'react';
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
      <div className="card">
        <p style={{ margin: 0 }}>
          Заявка принята. Ссылка для входа в кабинет отправлена на указанную почту.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <label className="field" htmlFor="pj-name">
        <span>Как к вам обращаться</span>
        <input id="pj-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label className="field" htmlFor="pj-email">
        <span>Почта</span>
        <input
          id="pj-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="field" htmlFor="pj-tax">
        <span>Налоговый статус: самозанятый, ИП или другое</span>
        <input
          id="pj-tax"
          value={taxStatus}
          onChange={(e) => setTaxStatus(e.target.value)}
          required
        />
      </label>

      <Consent checked={consent} onChange={setConsent} id="pj-consent" />

      {error && <p className="form-error">{error}</p>}

      <button className="cta" type="submit" disabled={busy}>
        {busy ? 'Минуту...' : 'Подключиться'}
      </button>
    </form>
  );
}
