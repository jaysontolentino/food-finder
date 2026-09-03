import type { SupportedLanguage } from "@food-finder/shared";
import type { OpenFoodFactsProduct } from "./open-food-facts.types.js";

export interface Product {
  barcode: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  nutrition: Record<string, number | string | undefined> | null;
}

export function mapProduct(
  product: OpenFoodFactsProduct,
  language: SupportedLanguage,
): Product {
  const localizedName =
    product[`product_name_${language}` as keyof OpenFoodFactsProduct];

  const name =
    typeof localizedName === "string" && localizedName.trim()
      ? localizedName
      : (product.product_name ?? "Unknown product");

  return {
    barcode: product.code ?? "",
    name,
    brand: product.brands ?? null,
    imageUrl: product.image_front_url ?? null,
    nutrition: product.nutriments ?? null,
  };
}
