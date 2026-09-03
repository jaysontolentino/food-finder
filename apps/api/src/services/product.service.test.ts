import { describe, expect, it } from "vitest";

import { mapProduct } from "./../integrations/open-food-facts/open-food-facts.mapper";
import { ProductService } from "./product.service";

describe("mapProduct", () => {
  it("uses the selected language when available", () => {
    const product = mapProduct(
      {
        code: "123",
        product_name: "Chocolade",
        product_name_en: "Chocolate",
        product_name_nl: "Chocolade",
        product_name_de: "Schokolade",
        product_name_fr: "Chocolat",
        brands: "Test Brand",
      },
      "de",
    );

    expect(product.name).toBe("Schokolade");
  });

  it("falls back to English when the selected language is unavailable", () => {
    const product = mapProduct(
      {
        code: "123",
        product_name: "Produit",
        product_name_en: "Product",
        product_name_fr: "Produit",
      },
      "de",
    );

    expect(product.name).toBe("Product");
  });

  it("falls back to the default product name", () => {
    const product = mapProduct(
      {
        code: "123",
        product_name: "Chocolate",
      },
      "fr",
    );

    expect(product.name).toBe("Chocolate");
  });

  it("uses Unknown product when no name is available", () => {
    const product = mapProduct(
      {
        code: "123",
      },
      "en",
    );

    expect(product.name).toBe("Unknown product");
  });

  it("handles missing brand and image", () => {
    const product = mapProduct(
      {
        code: "123",
        product_name: "Chocolate",
      },
      "en",
    );

    expect(product.brand).toBeNull();
    expect(product.imageUrl).toBeNull();
  });
});

describe("ProductService", () => {
  it("searches products and maps the response", async () => {
    const fakeClient = {
      searchProducts: async () => ({
        products: [
          {
            code: "123456789",
            product_name: "Nutella",
            product_name_en: "Nutella",
            brands: "Ferrero",
            image_front_url: "https://example.com/nutella.jpg",
          },
        ],
      }),
    };

    const fakeSearchRepository = {
      create: async () => undefined,
      findRecentByUser: async () => [],
    };

    const service = new ProductService(fakeClient, fakeSearchRepository);

    const products = await service.searchProducts(
      "fake-user-id",
      "  nutella  ",
      "en",
    );

    expect(products).toEqual([
      {
        barcode: "123456789",
        name: "Nutella",
        brand: "Ferrero",
        imageUrl: "https://example.com/nutella.jpg",
        nutrition: null,
      },
    ]);
  });

  it("returns an empty array for an empty query", async () => {
    const fakeClient = {
      searchProducts: async () => {
        throw new Error("Should not be called");
      },
    };

    const fakeSearchRepository = {
      create: async () => undefined,
      findRecentByUser: async () => [],
    };

    const service = new ProductService(fakeClient, fakeSearchRepository);

    const products = await service.searchProducts("fake-user-id", "   ", "en");

    expect(products).toEqual([]);
  });

  it("handles a response with no products", async () => {
    const fakeClient = {
      searchProducts: async () => ({
        products: undefined,
      }),
    };

    const fakeSearchRepository = {
      create: async () => undefined,
      findRecentByUser: async () => [],
    };

    const service = new ProductService(fakeClient, fakeSearchRepository);

    const products = await service.searchProducts(
      "fake-user-id",
      "nutella",
      "en",
    );

    expect(products).toEqual([]);
  });

  it("records the user's search", async () => {
    const createdSearches: Array<{
      userId: string;
      query: string;
      language: string;
    }> = [];

    const fakeSearchRepository = {
      create: async (userId: string, query: string, language: string) => {
        createdSearches.push({
          userId,
          query,
          language,
        });
      },

      findRecentByUser: async () => [],
    };

    const fakeClient = {
      searchProducts: async () => ({
        products: [],
      }),
    };

    const service = new ProductService(fakeClient, fakeSearchRepository);

    await service.searchProducts("demo-user-id", "  nutella  ", "en");

    expect(createdSearches).toEqual([
      {
        userId: "demo-user-id",
        query: "nutella",
        language: "EN",
      },
    ]);
  });
});
