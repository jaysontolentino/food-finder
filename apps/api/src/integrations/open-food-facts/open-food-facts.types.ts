export interface OpenFoodFactsProduct {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  product_name_nl?: string;
  product_name_de?: string;
  product_name_fr?: string;
  brands?: string;
  image_front_url?: string;
  nutriments?: Record<string, number | string | undefined>;
}

export interface OpenFoodFactsSearchResponse {
  count?: number;
  page?: number;
  page_count?: number;
  page_size?: number;
  products?: OpenFoodFactsProduct[];
}
