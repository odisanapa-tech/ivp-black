'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
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
      <div className="max-w-lg rounded-lg border border-rule bg-page p-6">
        <p className="text-[17px] text-ink/90">Заявка отправлена. Мы ответим на оставленный контакт.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-lg">
      <Field label="Как к вам обращаться" htmlFor="lead-name">
        <Input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>

      <Field label="Контакт: почта или телеграм" htmlFor="lead-contact">
        <Input id="lead-contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
      </Field>

      <Field label="Коротко о задаче, если есть что добавить" htmlFor="lead-comment">
        <Textarea id="lead-comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
      </Field>

      <Consent checked={consent} onChange={setConsent} id="lead-consent" />

      {error && <p className="mb-4 text-[15px] text-[#8B1D3F]">{error}</p>}

      <Button type="submit" size="lg" disabled={busy}>
        {busy ? 'Минуту...' : cta}
      </Button>
    </form>
  );
}
