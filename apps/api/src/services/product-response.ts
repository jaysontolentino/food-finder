import type { Product } from "../integrations/open-food-facts/open-food-facts.mapper.js";

export interface ProductResponse {
  barcode: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  nutrition?: Product["nutrition"];
}

export function toProductResponse(
  product: Product,
  includeNutrition: boolean,
): ProductResponse {
  return {
    barcode: product.barcode,
    name: product.name,
    brand: product.brand,
    imageUrl: product.imageUrl,
    ...(includeNutrition ? { nutrition: product.nutrition } : {}),
  };
}
