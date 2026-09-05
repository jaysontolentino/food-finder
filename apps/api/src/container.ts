import { OpenFoodFactsClient } from "./integrations/open-food-facts/open-food-facts.client";

import { SearchRepository } from "./repositories/search.repository";
import { UserRepository } from "./repositories/user.repository";
import { SubscriptionRepository } from "./repositories/subscription.repository";

import { ProductService } from "./services/product.service";
import { SearchService } from "./services/search.service";
import { SubscriptionService } from "./services/subscription.service";

import { ProductController } from "./controllers/product.controller";
import { SearchController } from "./controllers/search.controller";
import { SubscriptionController } from "./controllers/subscription.controller";
import { StripeWebhookController } from "./controllers/stripe-webhook.controller";

const openFoodFactsClient = new OpenFoodFactsClient();

const searchRepository = new SearchRepository();
const userRepository = new UserRepository();
const subscriptionRepository = new SubscriptionRepository();

const productService = new ProductService(
  openFoodFactsClient,
  searchRepository,
);
const searchService = new SearchService(searchRepository);
const subscriptionService = new SubscriptionService(
  userRepository,
  subscriptionRepository,
);

export const productController = new ProductController(
  productService,
  subscriptionService,
);
export const searchController = new SearchController(searchService);
export const subscriptionController = new SubscriptionController(
  subscriptionService,
);
export const stripeWebhookController = new StripeWebhookController(
  subscriptionService,
);
