import type { Metadata, Viewport } from 'next';
import { Manrope, Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site/Header';
import { SiteFooter } from '@/components/site/Footer';
import { SITE_NAME, SITE_URL } from '@/config/site';
import './globals.css';

/** Шрифты перенесены из старого сайта: Manrope для заголовков, Inter для текста. */
const display = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const body = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s - ИВП` },
  // Сайт закрыт от индексации до отдельной команды заказчика.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: '#F7F3EE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-3 focus:left-3 focus:bg-accent focus:text-white focus:px-3 focus:py-2 focus:rounded"
        >
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
