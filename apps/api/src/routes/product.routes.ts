import { Router } from "express";

import { OpenFoodFactsClient } from "../integrations/open-food-facts/open-food-facts.client.js";
import { toProductResponse } from "../services/product-response.js";
import { ProductService } from "../services/product.service.js";

const router = Router();

const openFoodFactsClient = new OpenFoodFactsClient();
const productService = new ProductService(openFoodFactsClient);

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

  try {
    const products = await productService.searchProducts(
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
    console.error("Product search failed:", error);

    return res.status(502).json({
      error: "Failed to retrieve products",
    });
  }
});

export default router;
