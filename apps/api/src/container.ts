import { OpenFoodFactsClient } from "./integrations/open-food-facts/open-food-facts.client";

import { SearchRepository } from "./repositories/search.repository";

import { ProductService } from "./services/product.service";
import { SearchService } from "./services/search.service";

import { ProductController } from "./controllers/product.controller";
import { SearchController } from "./controllers/search.controller";

const openFoodFactsClient = new OpenFoodFactsClient();

const searchRepository = new SearchRepository();

const productService = new ProductService(
  openFoodFactsClient,
  searchRepository,
);

const searchService = new SearchService(searchRepository);

export const productController = new ProductController(productService);

export const searchController = new SearchController(searchService);
