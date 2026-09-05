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
    <label className="consent" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        Я согласен на обработку персональных данных в соответствии с{' '}
        <Link href={ROUTES.privacy} target="_blank">
          политикой обработки персональных данных
        </Link>
      </span>
    </label>
  );
}
