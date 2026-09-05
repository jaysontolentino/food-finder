const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type SupportedLanguage = "en" | "nl" | "de" | "fr";

export interface Product {
  barcode: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  nutrition?: Record<string, number | string | undefined>;
}

export interface SearchResponse {
  products: Product[];
}

export interface RecentSearch {
  id: string;
  query: string;
  language: "EN" | "NL" | "DE" | "FR";
  createdAt: string;
}

export interface RecentSearchesResponse {
  searches: RecentSearch[];
}

export async function searchProducts(
  query: string,
  language: SupportedLanguage,
): Promise<Product[]> {
  const params = new URLSearchParams({
    q: query,
    lang: language,
  });

  const response = await fetch(
    `${API_URL}/api/products/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const data = (await response.json()) as SearchResponse;

  return data.products;
}

export async function getRecentSearches(): Promise<RecentSearch[]> {
  const response = await fetch(`${API_URL}/api/searches/recent`);

  if (!response.ok) {
    throw new Error("Failed to load recent searches");
  }

  const data = (await response.json()) as RecentSearchesResponse;

  return data.searches;
}

export async function getProductByBarcode(
  barcode: string,
  language: SupportedLanguage,
): Promise<Product> {
  const params = new URLSearchParams({
    lang: language,
  });

  const response = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(barcode)}?${params.toString()}`,
  );

  if (response.status === 404) {
    throw new Error("Product not found");
  }

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  const result = await response.json();

  return result.product as Product;
}
