import type { OpenFoodFactsSearchResponse } from "./open-food-facts.types";
import { OpenFoodFactsRateLimitError } from "./open-food-facts.errors";
import { SearchCache } from "../../lib/search-cache";

const searchCache = new SearchCache<OpenFoodFactsSearchResponse>(5 * 60 * 1000); // 5 minutes

const BASE_URL =
  process.env.OPEN_FOOD_FACTS_BASE_URL ?? "https://world.openfoodfacts.org";

const USER_AGENT = process.env.OPEN_FOOD_FACTS_USER_AGENT ?? "FoodFinder/1.0";

const USERNAME = process.env.OPEN_FOOD_FACTS_USERNAME;
const PASSWORD = process.env.OPEN_FOOD_FACTS_PASSWORD;

export class OpenFoodFactsClient {
  async searchProducts(query: string): Promise<OpenFoodFactsSearchResponse> {
    const cacheKey = query.trim().toLowerCase();

    const cached = searchCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const url = new URL("/cgi/search.pl", BASE_URL);

    url.searchParams.set("search_terms", query);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page_size", "20");
    url.searchParams.set(
      "fields",
      [
        "code",
        "product_name",
        "product_name_en",
        "product_name_nl",
        "product_name_de",
        "product_name_fr",
        "brands",
        "image_front_url",
        "nutriments",
      ].join(","),
    );

    const headers: Record<string, string> = {
      "User-Agent": USER_AGENT,
    };

    if (USERNAME && PASSWORD) {
      const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString(
        "base64",
      );

      headers.Authorization = `Basic ${credentials}`;
    }

    const response = await fetch(url, {
      headers,
    });

    if (response.status === 429 || response.status === 503) {
      throw new OpenFoodFactsRateLimitError();
    }

    if (!response.ok) {
      throw new Error(`Open Food Facts request failed: ${response.status}`);
    }

    const data = (await response.json()) as OpenFoodFactsSearchResponse;

    searchCache.set(cacheKey, data);

    return data;
  }
}
