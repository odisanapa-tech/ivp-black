/** Шапка обычной страницы: подложка и заголовок, как на страницах продуктов. */
export function PageHeader({
  kicker,
  title,
  lead,
  wide = false,
}: {
  kicker?: string;
  title: string;
  lead?: React.ReactNode;
  wide?: boolean;
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
      <div className={`${wide ? 'container-tight' : 'container-prose'} pt-14 md:pt-20 pb-10 md:pb-14`}>
        {kicker && (
          <div className="kicker mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
            {kicker}
          </div>
        )}
        <h1 className="text-display-2 font-display text-ink">{title}</h1>
        {lead && <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl">{lead}</p>}
      </div>
    </section>
  );
}
