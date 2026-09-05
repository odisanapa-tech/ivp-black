import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { PARTNER } from '@/config/partner';

/**
 * Партнерская метка. Ссылка вида /atlas?ref=КОД.
 *
 * Код кладется в cookie на 180 дней и снимается с адреса, чтобы ученик не
 * пересылал ссылку с чужой меткой дальше. Первый партнер важнее последнего:
 * перезаписываем cookie только если ее еще нет.
 */
export function middleware(req: NextRequest, event: NextFetchEvent) {
  const code = req.nextUrl.searchParams.get(PARTNER.queryParam);
  if (!code) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.searchParams.delete(PARTNER.queryParam);
  const res = NextResponse.redirect(url);

  const existing = req.cookies.get(PARTNER.cookieName)?.value;
  if (!existing) {
    res.cookies.set(PARTNER.cookieName, code, {
      maxAge: PARTNER.cookieDays * 24 * 60 * 60,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }

  // Переход записывается в базу отдельным запросом: в middleware нет
  // подключения к Postgres, оно живет только в серверных обработчиках.
  event.waitUntil(
    fetch(new URL('/api/ref/visit', req.nextUrl.origin), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code, path: req.nextUrl.pathname }),
    }).catch(() => undefined),
  );

  return res;
}

export const config = {
  // Служебные адреса метку не обрабатывают.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
