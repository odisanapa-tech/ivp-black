'use client';

import { useState } from 'react';

/** Поле с кнопкой копирования. Используется для ссылок и готовых текстов. */
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
    <div className="box">
      {multiline ? (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            font: 'inherit',
            margin: '0 0 14px',
          }}
        >
          {value}
        </pre>
      ) : (
        <p style={{ margin: '0 0 14px', wordBreak: 'break-all' }}>{value}</p>
      )}
      <button className="cta-secondary" onClick={copy} type="button">
        {copied ? 'Скопировано' : 'Скопировать'}
      </button>
    </div>
  );
}
