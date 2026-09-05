import { env } from "../../config/env";
import type {
  OpenFoodFactsProduct,
  OpenFoodFactsSearchResponse,
} from "./open-food-facts.types";
import { OpenFoodFactsRateLimitError } from "./open-food-facts.errors";
import { SearchCache } from "../../lib/search-cache";

const searchCache = new SearchCache<OpenFoodFactsSearchResponse>(5 * 60 * 1000); // 5 minutes

const BASE_URL = env.openFoodFactsBaseUrl;

const USER_AGENT = env.openFoodFactsUserAgent;

const USERNAME = env.openFoodFactsUsername;
const PASSWORD = env.openFoodFactsPassword;

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

  async getProductByBarcode(
    barcode: string,
  ): Promise<OpenFoodFactsProduct | null> {
    const url = new URL(
      `/api/v2/product/${encodeURIComponent(barcode)}.json`,
      BASE_URL,
    );

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

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (response.status === 429 || response.status === 503) {
      throw new OpenFoodFactsRateLimitError();
    }

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Open Food Facts request failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      status?: number;
      product?: OpenFoodFactsProduct;
    };

    if (data.status !== 1 || !data.product) {
      return null;
    }

    return data.product;
  }
}
