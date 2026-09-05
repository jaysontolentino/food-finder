import "dotenv/config";

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",

  apiPort: Number(process.env.API_PORT ?? 4000),

  demoUserId: requiredEnv("DEMO_USER_ID"),

  openFoodFactsBaseUrl:
    process.env.OPEN_FOOD_FACTS_BASE_URL ?? "https://world.openfoodfacts.org",
  openFoodFactsUserAgent:
    process.env.OPEN_FOOD_FACTS_USER_AGENT ?? "FoodFinder/1.0",
  openFoodFactsUsername: process.env.OPEN_FOOD_FACTS_USERNAME,
  openFoodFactsPassword: process.env.OPEN_FOOD_FACTS_PASSWORD,

  databaseUrl: requiredEnv("DATABASE_URL"),
  databaseUser: requiredEnv("DATABASE_USER"),
  databasePassword: requiredEnv("DATABASE_PASSWORD"),
  databaseName: requiredEnv("DATABASE_NAME"),
  databaseHost: process.env.DATABASE_HOST ?? "localhost",
  databasePort: process.env.DATABASE_PORT ?? 3306,

  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripePriceId: process.env.STRIPE_PRICE_ID,
};
