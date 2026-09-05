import Link from 'next/link';
import { ROUTES } from '@/config/site';

/**
 * Согласие на обработку персональных данных.
 * Галочка пустая и не предзаполненная, ссылка ведет на существующую страницу.
 * Конклюдентное согласие ("нажимая кнопку, вы соглашаетесь") не используется.
 */
export function Consent({
  checked,
  onChange,
  id = 'consent',
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  id?: string;
}) {
  return (
    <label htmlFor={id} className="flex gap-3 items-start mb-5 text-[15px] text-muted leading-relaxed">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-[#6E4C7A]"
      />
      <span>
        Я согласен на обработку персональных данных в соответствии с{' '}
        <Link href={ROUTES.privacy} target="_blank" className="link-underline">
          политикой обработки персональных данных
        </Link>
      </span>
    </label>
  );
}
