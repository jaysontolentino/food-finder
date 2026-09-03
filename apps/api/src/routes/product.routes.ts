import { Router } from "express";

import { OpenFoodFactsClient } from "../integrations/open-food-facts/open-food-facts.client";
import { OpenFoodFactsRateLimitError } from "../integrations/open-food-facts/open-food-facts.errors";
import { toProductResponse } from "../services/product-response";
import { ProductService } from "../services/product.service";
import { SearchRepository } from "../repositories/search.repository";

const router = Router();

const openFoodFactsClient = new OpenFoodFactsClient();
const searchRepository = new SearchRepository();
const productService = new ProductService(
  openFoodFactsClient,
  searchRepository,
);

const supportedLanguages = ["en", "nl", "de", "fr"] as const;

type SupportedLanguage = (typeof supportedLanguages)[number];

router.get("/search", async (req, res) => {
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

  const demoUserId = process.env.DEMO_USER_ID;

  if (!demoUserId) {
    throw new Error("DEMO_USER_ID is not configured.");
  }

  try {
    const products = await productService.searchProducts(
      demoUserId,
      query,
      language as SupportedLanguage,
    );

    const includeNutrition = false;

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
});

export default router;
