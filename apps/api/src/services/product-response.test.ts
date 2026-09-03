import { describe, expect, it } from "vitest";

import { toProductResponse } from "./product-response.js";

const product = {
  barcode: "123456",
  name: "Nutella",
  brand: "Ferrero",
  imageUrl: "https://example.com/nutella.jpg",
  nutrition: {
    energy: 539,
    fat: 30.9,
  },
};

describe("toProductResponse", () => {
  it("excludes nutrition for non-subscribers", () => {
    const response = toProductResponse(product, false);

    expect(response).toEqual({
      barcode: "123456",
      name: "Nutella",
      brand: "Ferrero",
      imageUrl: "https://example.com/nutella.jpg",
    });

    expect(response).not.toHaveProperty("nutrition");
  });

  it("includes nutrition for subscribers", () => {
    const response = toProductResponse(product, true);

    expect(response).toEqual({
      barcode: "123456",
      name: "Nutella",
      brand: "Ferrero",
      imageUrl: "https://example.com/nutella.jpg",
      nutrition: {
        energy: 539,
        fat: 30.9,
      },
    });
  });

  it("keeps nutrition null when subscriber has no nutrition data", () => {
    const response = toProductResponse(
      {
        ...product,
        nutrition: null,
      },
      true,
    );

    expect(response.nutrition).toBeNull();
  });
});
