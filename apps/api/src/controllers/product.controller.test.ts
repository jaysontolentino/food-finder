import { describe, expect, it, vi } from "vitest";

import { OpenFoodFactsRateLimitError } from "../integrations/open-food-facts/open-food-facts.errors";
import { ProductController } from "./product.controller";

describe("ProductController", () => {
  const product = {
    barcode: "123456789",
    name: "Test Chocolate",
    brand: "Test Brand",
    imageUrl: "https://example.com/image.jpg",
    nutrition: {
      "energy-kcal_100g": 500,
      fat_100g: 25,
      proteins_100g: 8,
    },
  };

  function createController({
    canAccessNutrition = false,
    searchProducts = vi.fn().mockResolvedValue([product]),
    getProductByBarcode = vi.fn().mockResolvedValue(product),
  } = {}) {
    const productService = {
      searchProducts,
      getProductByBarcode,
    };

    const subscriptionService = {
      canAccessNutrition: vi.fn().mockResolvedValue(canAccessNutrition),
    };

    const controller = new ProductController(
      productService as any,
      subscriptionService as any,
    );

    return {
      controller,
      productService,
      subscriptionService,
    };
  }

  function createResponse() {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    return res;
  }

  describe("search", () => {
    it("returns basic product information for a free user", async () => {
      const { controller, subscriptionService } = createController({
        canAccessNutrition: false,
      });

      const req = {
        query: {
          q: "chocolate",
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.search(req, res as any);

      expect(subscriptionService.canAccessNutrition).toHaveBeenCalledWith(
        "demo-user-id",
      );

      expect(res.json).toHaveBeenCalledWith({
        products: [
          {
            barcode: "123456789",
            name: "Test Chocolate",
            brand: "Test Brand",
            imageUrl: "https://example.com/image.jpg",
          },
        ],
      });
    });

    it("includes nutrition for an active subscriber", async () => {
      const { controller } = createController({
        canAccessNutrition: true,
      });

      const req = {
        query: {
          q: "chocolate",
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.search(req, res as any);

      expect(res.json).toHaveBeenCalledWith({
        products: [
          {
            barcode: "123456789",
            name: "Test Chocolate",
            brand: "Test Brand",
            imageUrl: "https://example.com/image.jpg",
            nutrition: {
              "energy-kcal_100g": 500,
              fat_100g: 25,
              proteins_100g: 8,
            },
          },
        ],
      });
    });

    it("returns 400 when search query is missing", async () => {
      const { controller } = createController();

      const req = {
        query: {
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.search(req, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Search query is required",
      });
    });

    it("returns 400 for an unsupported language", async () => {
      const { controller } = createController();

      const req = {
        query: {
          q: "chocolate",
          lang: "es",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.search(req, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unsupported language",
      });
    });

    it("returns 503 when Open Food Facts is rate limited", async () => {
      const { controller } = createController({
        searchProducts: vi
          .fn()
          .mockRejectedValue(new OpenFoodFactsRateLimitError()),
      });

      const req = {
        query: {
          q: "chocolate",
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.search(req, res as any);

      expect(res.status).toHaveBeenCalledWith(503);
    });
  });

  describe("getByBarcode", () => {
    it("returns basic product information for a free user", async () => {
      const { controller } = createController({
        canAccessNutrition: false,
      });

      const req = {
        params: {
          barcode: "123456789",
        },
        query: {
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.getByBarcode(req, res as any);

      expect(res.json).toHaveBeenCalledWith({
        product: {
          barcode: "123456789",
          name: "Test Chocolate",
          brand: "Test Brand",
          imageUrl: "https://example.com/image.jpg",
        },
      });
    });

    it("includes nutrition for an active subscriber", async () => {
      const { controller } = createController({
        canAccessNutrition: true,
      });

      const req = {
        params: {
          barcode: "123456789",
        },
        query: {
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.getByBarcode(req, res as any);

      expect(res.json).toHaveBeenCalledWith({
        product: {
          barcode: "123456789",
          name: "Test Chocolate",
          brand: "Test Brand",
          imageUrl: "https://example.com/image.jpg",
          nutrition: {
            "energy-kcal_100g": 500,
            fat_100g: 25,
            proteins_100g: 8,
          },
        },
      });
    });

    it("returns 404 when the product does not exist", async () => {
      const { controller } = createController({
        getProductByBarcode: vi.fn().mockResolvedValue(null),
      });

      const req = {
        params: {
          barcode: "999999999",
        },
        query: {
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.getByBarcode(req, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Product not found",
      });
    });

    it("returns 400 when the barcode is missing", async () => {
      const { controller } = createController();

      const req = {
        params: {},
        query: {
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.getByBarcode(req, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Barcode is required",
      });
    });

    it("returns 400 for an invalid language", async () => {
      const { controller } = createController();

      const req = {
        params: {
          barcode: "123456789",
        },
        query: {
          lang: "es",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.getByBarcode(req, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid language",
      });
    });

    it("returns 503 when Open Food Facts is rate limited", async () => {
      const { controller } = createController({
        getProductByBarcode: vi
          .fn()
          .mockRejectedValue(new OpenFoodFactsRateLimitError()),
      });

      const req = {
        params: {
          barcode: "123456789",
        },
        query: {
          lang: "en",
        },
        userId: "demo-user-id",
      } as any;

      const res = createResponse();

      await controller.getByBarcode(req, res as any);

      expect(res.status).toHaveBeenCalledWith(503);
    });
  });
});
