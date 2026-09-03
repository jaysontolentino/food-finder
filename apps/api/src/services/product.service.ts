import type { SupportedLanguage } from "@food-finder/shared";
import type { Language } from "../generated/prisma/client";

import {
  mapProduct,
  type Product,
} from "../integrations/open-food-facts/open-food-facts.mapper";

import { OpenFoodFactsClient } from "../integrations/open-food-facts/open-food-facts.client";
import { ISearchRepository } from "../repositories/search.repository";

const languageMap: Record<SupportedLanguage, Language> = {
  en: "EN",
  nl: "NL",
  de: "DE",
  fr: "FR",
};

export class ProductService {
  constructor(
    private readonly openFoodFactsClient: OpenFoodFactsClient,
    private readonly searchRepository: ISearchRepository,
  ) {}

  async searchProducts(
    userId: string,
    query: string,
    language: SupportedLanguage,
  ): Promise<Product[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    await this.searchRepository.create(
      userId,
      normalizedQuery,
      languageMap[language],
    );

    const response =
      await this.openFoodFactsClient.searchProducts(normalizedQuery);

    return (response.products ?? []).map((product) =>
      mapProduct(product, language),
    );
  }
}
