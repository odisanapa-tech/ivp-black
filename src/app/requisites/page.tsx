import type { Metadata } from 'next';
import { CONTACTS } from '@/config/site';

export const metadata: Metadata = { title: 'Реквизиты' };

/** ЧЕРНОВИК: реквизиты заказчиком не переданы, показаны пропуски. */
export default function RequisitesPage() {
  return (
    <article>
      <h1>Реквизиты</h1>

      <div className="dev-note">
        Черновик. Реквизиты заказчиком не переданы, пропуски видны в 【скобках】.
      </div>

      <table className="table">
        <tbody>
          <tr>
            <th>Наименование</th>
            <td>{CONTACTS.legalEntity}</td>
          </tr>
          <tr>
            <th>ИНН</th>
            <td>{CONTACTS.inn}</td>
          </tr>
          <tr>
            <th>ОГРН</th>
            <td>{CONTACTS.ogrn}</td>
          </tr>
          <tr>
            <th>Адрес</th>
            <td>{CONTACTS.legalAddress}</td>
          </tr>
          <tr>
            <th>Банковские реквизиты</th>
            <td>{CONTACTS.bankDetails}</td>
          </tr>
          <tr>
            <th>Почта</th>
            <td>{CONTACTS.publicEmail}</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
