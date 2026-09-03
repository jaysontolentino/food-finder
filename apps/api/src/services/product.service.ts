import type { SupportedLanguage } from "@food-finder/shared";

import {
  mapProduct,
  type Product,
} from "../integrations/open-food-facts/open-food-facts.mapper.js";

import { OpenFoodFactsClient } from "../integrations/open-food-facts/open-food-facts.client.js";

export class ProductService {
  constructor(private readonly openFoodFactsClient: OpenFoodFactsClient) {}

  async searchProducts(
    query: string,
    language: SupportedLanguage,
  ): Promise<Product[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    const response =
      await this.openFoodFactsClient.searchProducts(normalizedQuery);

    return (response.products ?? []).map((product) =>
      mapProduct(product, language),
    );
  }
}
