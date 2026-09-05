import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { priceLabel, type Product } from '@/config/products';

/**
 * Карточка продукта в лестнице. Форма перенесена из карточки программы
 * старого сайта. Содержимое: название, одна строка, автор, цена, кнопка.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="default">{product.author}</Badge>
        </div>

        <h3 className="font-display text-ink font-medium leading-tight text-[20px]">
          {product.title}
        </h3>

        <p className="mt-3 text-[15px] text-muted leading-relaxed">{product.summary}</p>

        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted/80">Стоимость</div>
          <div className="mt-0.5 text-ink font-medium">{priceLabel(product)}</div>
        </div>

        <div className="mt-auto pt-6">
          <Link
            href={product.href}
            className="inline-flex items-center gap-1.5 text-[14px] text-accent hover:text-accent-hover font-medium"
          >
            {product.kind === 'lead' ? 'Оставить заявку' : 'Подробнее'}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
