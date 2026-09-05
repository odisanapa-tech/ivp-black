import * as React from 'react';
import { cn } from '@/lib/cn';

/** Поля форм перенесены из старого сайта. */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full h-11 rounded-md border border-rule bg-page/60 px-3.5 text-[15px] text-ink placeholder:text-muted',
        'focus:border-accent focus:bg-page focus:outline-none disabled:opacity-60',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full min-h-[120px] rounded-md border border-rule bg-page/60 px-3.5 py-3 text-[15px] text-ink placeholder:text-muted',
      'focus:border-accent focus:bg-page focus:outline-none',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

/** Подпись над полем. */
export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="block mb-1.5 text-[14px] text-muted">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[13px] text-muted">{hint}</p>}
    </div>
  );
}
