import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Profile } from '@/config/profiles';

/** Карточка профиля педагога. Примеры помечены плашкой явно. */
export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        {profile.isExample && (
          <div className="mb-4">
            <Badge variant="planned">Пример заполнения</Badge>
          </div>
        )}

        <h3 className="font-display text-[20px] font-medium text-ink">{profile.name}</h3>
        <p className="mt-1 text-[14px] text-muted">{profile.city}</p>

        <p className="mt-4 text-[15px] text-ink/90 leading-relaxed">{profile.method}</p>

        <dl className="mt-6 space-y-3 text-[14px]">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-muted/80">Форматы</dt>
            <dd className="mt-0.5 text-ink">{profile.formats.join(', ')}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-muted/80">С кем работает</dt>
            <dd className="mt-0.5 text-ink">{profile.worksWith}</dd>
          </div>
        </dl>

        <div className="mt-auto pt-6 text-[14px]">
          {profile.contact ? (
            <span className="text-accent">{profile.contact}</span>
          ) : (
            <span className="text-muted">
              Контакт появляется в профиле после согласия педагога на публикацию
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
