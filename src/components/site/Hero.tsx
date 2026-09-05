import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Первый экран перенесен из старого сайта: подложка на всю ширину,
 * надзаголовок, крупный H1, подзаголовок и две кнопки.
 */
export function Hero({
  kicker,
  title,
  lead,
  primary,
  secondary,
}: {
  kicker: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            'radial-gradient(60% 55% at 78% 18%, #EDE4F0 0%, transparent 60%), radial-gradient(50% 45% at 8% 90%, #F1E7D8 0%, transparent 55%)',
        }}
      />
      <div className="container-tight pt-14 md:pt-24 pb-16 md:pb-24">
        <div className="max-w-3xl animate-fade-up">
          <div className="kicker mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
            {kicker}
          </div>
          <h1 className="text-display-1 font-display text-ink">{title}</h1>
          <p className="mt-6 text-lg md:text-xl text-muted leading-relaxed max-w-2xl">{lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {secondary && (
              <Button asChild size="lg" variant="secondary">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
