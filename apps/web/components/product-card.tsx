import Link from "next/link";

import type { Product, SupportedLanguage } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  language: SupportedLanguage;
}

export function ProductCard({ product, language }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex aspect-square items-center justify-center bg-gray-50 p-6">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-sm text-gray-400">No image</span>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h2 className="line-clamp-2 font-semibold text-gray-900">
            {product.name}
          </h2>

          {product.brand && (
            <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
          )}
        </div>

        <p className="text-xs text-gray-400">Barcode: {product.barcode}</p>

        <Link
          href={`/products/${product.barcode}?lang=${language}`}
          className="inline-flex text-sm font-medium text-gray-900 hover:underline"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
