import type { SupportedLanguage } from "@food-finder/shared";

import type { OpenFoodFactsProduct } from "./open-food-facts.types.js";

export interface Product {
  barcode: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  nutrition: Record<string, number | string | undefined> | null;
}

function getLocalizedName(
  product: OpenFoodFactsProduct,
  language: SupportedLanguage,
): string {
  const localizedNames: Record<SupportedLanguage, string | undefined> = {
    en: product.product_name_en,
    nl: product.product_name_nl,
    de: product.product_name_de,
    fr: product.product_name_fr,
  };

  return (
    localizedNames[language]?.trim() ||
    product.product_name_en?.trim() ||
    product.product_name?.trim() ||
    "Unknown product"
  );
}

export function mapProduct(
  product: OpenFoodFactsProduct,
  language: SupportedLanguage,
): Product {
  return {
    barcode: product.code ?? "",
    name: getLocalizedName(product, language),
    brand: product.brands?.trim() || null,
    imageUrl: product.image_front_url ?? null,
    nutrition: product.nutriments ?? null,
  };
}
