import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  brandLabel: string;
}

export function ProductCard({ product, brandLabel }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-square bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="font-semibold">{product.name}</h3>

        {product.brand && (
          <p className="text-sm text-gray-500">
            {brandLabel}: {product.brand}
          </p>
        )}
      </div>
    </article>
  );
}
