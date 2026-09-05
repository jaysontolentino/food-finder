import type { Request, Response } from "express";

import { OpenFoodFactsRateLimitError } from "../integrations/open-food-facts/open-food-facts.errors";
import { toProductResponse } from "../services/product-response";
import type { ProductService } from "../services/product.service";
import type { SubscriptionService } from "../services/subscription.service";

const supportedLanguages = ["en", "nl", "de", "fr"] as const;

type SupportedLanguage = (typeof supportedLanguages)[number];

export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async search(req: Request, res: Response) {
    const query = typeof req.query.q === "string" ? req.query.q : "";

    const language = typeof req.query.lang === "string" ? req.query.lang : "en";

    if (!query.trim()) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    if (!supportedLanguages.includes(language as SupportedLanguage)) {
      return res.status(400).json({
        error: "Unsupported language",
      });
    }

    try {
      const products = await this.productService.searchProducts(
        req.userId,
        query,
        language as SupportedLanguage,
      );

      const includeNutrition =
        await this.subscriptionService.canAccessNutrition(req.userId);

      return res.json({
        products: products.map((product) =>
          toProductResponse(product, includeNutrition),
        ),
      });
    } catch (error) {
      if (error instanceof OpenFoodFactsRateLimitError) {
        return res.status(503).json({
          error:
            "Product search is temporarily unavailable. Please try again shortly.",
        });
      }

      console.error("Product search failed:", error);

      return res.status(502).json({
        error: "Failed to retrieve products",
      });
    }
  }
}
