import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/PageHeader';
import { Notice } from '@/components/ui/section';
import { CONTACTS } from '@/config/site';

export const metadata: Metadata = { title: 'Реквизиты' };

/** ЧЕРНОВИК: реквизиты заказчиком не переданы, показаны пропуски. */
export default function RequisitesPage() {
  return (
    <>
      <PageHeader kicker="Документы" title="Реквизиты" />
      <div className="container-prose pb-20 md:pb-28">
        <div className="mb-8">
          <Notice tone="draft">
            Черновик. Реквизиты заказчиком не переданы, пропуски видны в【скобках】.
          </Notice>
        </div>

      <table className="w-full text-[16px]">
        <tbody>
          <tr>
            <th className="text-left align-top py-3 pr-6 border-b border-rule text-[14px] text-muted font-medium w-[45%]">Наименование</th>
            <td className="text-left align-top py-3 border-b border-rule text-ink">{CONTACTS.legalEntity}</td>
          </tr>
          <tr>
            <th className="text-left align-top py-3 pr-6 border-b border-rule text-[14px] text-muted font-medium w-[45%]">ИНН</th>
            <td className="text-left align-top py-3 border-b border-rule text-ink">{CONTACTS.inn}</td>
          </tr>
          <tr>
            <th className="text-left align-top py-3 pr-6 border-b border-rule text-[14px] text-muted font-medium w-[45%]">ОГРН</th>
            <td className="text-left align-top py-3 border-b border-rule text-ink">{CONTACTS.ogrn}</td>
          </tr>
          <tr>
            <th className="text-left align-top py-3 pr-6 border-b border-rule text-[14px] text-muted font-medium w-[45%]">Адрес</th>
            <td className="text-left align-top py-3 border-b border-rule text-ink">{CONTACTS.legalAddress}</td>
          </tr>
          <tr>
            <th className="text-left align-top py-3 pr-6 border-b border-rule text-[14px] text-muted font-medium w-[45%]">Банковские реквизиты</th>
            <td className="text-left align-top py-3 border-b border-rule text-ink">{CONTACTS.bankDetails}</td>
          </tr>
          <tr>
            <th className="text-left align-top py-3 pr-6 border-b border-rule text-[14px] text-muted font-medium w-[45%]">Почта</th>
            <td className="text-left align-top py-3 border-b border-rule text-ink">{CONTACTS.publicEmail}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </>
  );
}
