import type { OpenFoodFactsSearchResponse } from "./open-food-facts.types.js";

const BASE_URL =
  process.env.OPEN_FOOD_FACTS_BASE_URL ?? "https://world.openfoodfacts.org";

export class OpenFoodFactsClient {
  async searchProducts(query: string): Promise<OpenFoodFactsSearchResponse> {
    const url = new URL("/cgi/search.pl", BASE_URL);

    url.searchParams.set("search_terms", query);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page_size", "20");
    url.searchParams.set(
      "fields",
      "code,product_name,product_name_en,product_name_nl,product_name_de,product_name_fr,brands,image_front_url,nutriments",
    );

    const response = await fetch(url, {
      headers: {
        "User-Agent": "FoodFinder/1.0 (foodfactsfinder@example.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`Open Food Facts request failed: ${response.status}`);
    }

    return response.json() as Promise<OpenFoodFactsSearchResponse>;
  }
}
