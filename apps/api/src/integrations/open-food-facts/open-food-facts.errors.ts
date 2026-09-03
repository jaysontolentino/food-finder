export class OpenFoodFactsRateLimitError extends Error {
  constructor() {
    super("Open Food Facts rate limit exceeded");

    this.name = "OpenFoodFactsRateLimitError";
  }
}
