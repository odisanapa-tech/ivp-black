'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

/** Поле с кнопкой копирования: ссылки и готовые тексты. */
export function CopyBox({ value, multiline = false }: { value: string; multiline?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-lg border border-rule bg-page p-5 mb-4">
      {multiline ? (
        <pre className="whitespace-pre-wrap font-sans text-[15px] text-ink/90 leading-relaxed mb-4">
          {value}
        </pre>
      ) : (
        <p className="break-all text-[15px] text-ink/90 mb-4">{value}</p>
      )}
      <Button variant="secondary" size="sm" onClick={copy} type="button">
        {copied ? 'Скопировано' : 'Скопировать'}
      </Button>
    </div>
  );
}
