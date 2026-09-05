'use client';

import { useState } from 'react';
import { Consent } from './Consent';

/** Заявка вместо оплаты. Поля: имя, контакт, короткий комментарий. */
export function LeadForm({ productId, cta }: { productId: string; cta: string }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId, name, contact, comment, consent }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setBusy(false);
    if (!res?.ok) {
      setError(data?.error ?? 'Не удалось отправить. Попробуйте еще раз');
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="card">
        <p style={{ margin: 0 }}>
          Заявка отправлена. Мы ответим на оставленный контакт.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <label className="field" htmlFor="lead-name">
        <span>Как к вам обращаться</span>
        <input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label className="field" htmlFor="lead-contact">
        <span>Контакт: почта или телеграм</span>
        <input
          id="lead-contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </label>

      <label className="field" htmlFor="lead-comment">
        <span>Коротко о задаче, если есть что добавить</span>
        <textarea
          id="lead-comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>

      <Consent checked={consent} onChange={setConsent} id="lead-consent" />

      {error && <p className="form-error">{error}</p>}

      <button className="cta" type="submit" disabled={busy}>
        {busy ? 'Минуту...' : cta}
      </button>
    </form>
  );
}
