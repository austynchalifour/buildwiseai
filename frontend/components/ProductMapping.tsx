import { ProductMatch } from '@/lib/types';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';

function retailerLabel(r: ProductMatch['retailer']) {
  return r === 'home_depot' ? 'Home Depot' : "Lowe's";
}

export default function ProductMapping({ products }: { products: ProductMatch[] }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-bold">Product Matches</h2>
      <p className="mt-1 text-sm text-slate-400">Matched from Home Depot & Lowe&apos;s catalogs</p>
      <div className="mt-4 space-y-3">
        {products.map((p) => (
          <div key={p.materialName} className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{p.materialName}</p>
                <p className="mt-0.5 font-medium text-white">{p.productName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {retailerLabel(p.retailer)} · SKU {p.sku}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-brand-400">${p.price.toFixed(2)}</p>
                <span className="mt-1 flex items-center justify-end gap-1 text-xs">
                  {p.inStock ? (
                    <><CheckCircle className="h-3 w-3 text-brand-400" /> In stock</>
                  ) : (
                    <><XCircle className="h-3 w-3 text-red-400" /> Out of stock</>
                  )}
                </span>
              </div>
            </div>
            {p.substitute && (
              <p className="mt-2 text-xs text-yellow-500/80">{p.substitute}</p>
            )}
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-brand-400 hover:underline"
            >
              View product <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
