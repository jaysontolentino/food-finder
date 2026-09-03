import type { Product } from "@/lib/api";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  brandLabel: string;
  emptyMessage: string;
}

export function ProductGrid({
  products,
  brandLabel,
  emptyMessage,
}: ProductGridProps) {
  if (products.length === 0) {
    return <p className="py-10 text-center text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.barcode}
          product={product}
          brandLabel={brandLabel}
        />
      ))}
    </div>
  );
}
