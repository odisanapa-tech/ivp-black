import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { activePartnerByCode } from '@/lib/orders';

export const runtime = 'nodejs';

/**
 * Запись перехода по партнерской ссылке для экрана "Переходы".
 * Личных данных не хранится: visitor_hash нужен только чтобы не считать
 * один и тот же заход дважды.
 */
export async function POST(req: Request) {
  try {
    const { code, path } = (await req.json()) as { code?: string; path?: string };
    if (!code) return NextResponse.json({ ok: false }, { status: 400 });

    const partner = await activePartnerByCode(code);
    if (!partner) return NextResponse.json({ ok: true, ignored: true });

    const fingerprint = [
      req.headers.get('x-forwarded-for') ?? '',
      req.headers.get('user-agent') ?? '',
    ].join('|');
    const visitorHash = createHash('sha256')
      .update(`${process.env.VISIT_SALT ?? 'ivp'}:${fingerprint}`)
      .digest('hex')
      .slice(0, 32);

    await query(
      `INSERT INTO ref_visits (partner_id, path, visitor_hash) VALUES ($1, $2, $3)`,
      [partner.id, path ?? '/', visitorHash],
    );
    return NextResponse.json({ ok: true });
  } catch {
    // Счетчик переходов не должен ронять страницу.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
