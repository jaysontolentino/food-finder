import { beforeEach, describe, expect, it, vi } from "vitest";

import { OpenFoodFactsRateLimitError } from "./open-food-facts.errors";
import { OpenFoodFactsClient } from "./open-food-facts.client";

describe("OpenFoodFactsClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("searchProducts", () => {
    it("returns the Open Food Facts response", async () => {
      const data = {
        count: 1,
        products: [
          {
            code: "123456789",
            product_name: "Test Chocolate",
            brands: "Test Brand",
          },
        ],
      };

      const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      const client = new OpenFoodFactsClient();

      const result = await client.searchProducts(
        `unique-chocolate-${Date.now()}`,
      );

      expect(result).toEqual(data);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("throws a rate limit error for 429", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(null, { status: 429 }),
      );

      const client = new OpenFoodFactsClient();

      await expect(
        client.searchProducts(`rate-limit-${Date.now()}`),
      ).rejects.toBeInstanceOf(OpenFoodFactsRateLimitError);
    });

    it("throws a rate limit error for 503", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(null, { status: 503 }),
      );

      const client = new OpenFoodFactsClient();

      await expect(
        client.searchProducts(`unavailable-${Date.now()}`),
      ).rejects.toBeInstanceOf(OpenFoodFactsRateLimitError);
    });

    it("throws an error for other HTTP failures", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(null, { status: 500 }),
      );

      const client = new OpenFoodFactsClient();

      await expect(
        client.searchProducts(`server-error-${Date.now()}`),
      ).rejects.toThrow("Open Food Facts request failed: 500");
    });

    it("uses the cache for repeated searches", async () => {
      const data = {
        count: 1,
        products: [
          {
            code: "987654321",
            product_name: "Cached Product",
          },
        ],
      };

      const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      const client = new OpenFoodFactsClient();
      const query = `cached-product-${Date.now()}`;

      const firstResult = await client.searchProducts(query);
      const secondResult = await client.searchProducts(query);

      expect(firstResult).toEqual(data);
      expect(secondResult).toEqual(data);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProductByBarcode", () => {
    it("returns a product when Open Food Facts finds it", async () => {
      const product = {
        code: "123456789",
        product_name: "Test Chocolate",
        brands: "Test Brand",
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 1,
            product,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      const client = new OpenFoodFactsClient();

      await expect(client.getProductByBarcode("123456789")).resolves.toEqual(
        product,
      );
    });

    it("returns null when the product is not found", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(null, { status: 404 }),
      );

      const client = new OpenFoodFactsClient();

      await expect(client.getProductByBarcode("999999999")).resolves.toBeNull();
    });

    it("returns null when Open Food Facts returns status 0", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 0,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      const client = new OpenFoodFactsClient();

      await expect(client.getProductByBarcode("999999999")).resolves.toBeNull();
    });

    it("throws a rate limit error for barcode requests returning 429", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(null, { status: 429 }),
      );

      const client = new OpenFoodFactsClient();

      await expect(
        client.getProductByBarcode("123456789"),
      ).rejects.toBeInstanceOf(OpenFoodFactsRateLimitError);
    });

    it("throws an error for other barcode HTTP failures", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(null, { status: 500 }),
      );

      const client = new OpenFoodFactsClient();

      await expect(client.getProductByBarcode("123456789")).rejects.toThrow(
        "Open Food Facts request failed: 500",
      );
    });
  });
});
