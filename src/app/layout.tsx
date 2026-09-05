import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { SITE_NAME, SITE_URL } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s - ИВП` },
  // Сайт закрыт от индексации до отдельной команды заказчика.
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <SiteHeader />
        <main className="wrap">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
