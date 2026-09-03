import { describe, expect, it, vi } from "vitest";

import { SearchCache } from "./search-cache.js";

describe("SearchCache", () => {
  it("returns a cached value before it expires", () => {
    const cache = new SearchCache<string>(5_000);

    cache.set("nutella", "cached result");

    expect(cache.get("nutella")).toBe("cached result");
  });

  it("returns undefined after the cache expires", () => {
    vi.useFakeTimers();

    const cache = new SearchCache<string>(5_000);

    cache.set("nutella", "cached result");

    vi.advanceTimersByTime(5_001);

    expect(cache.get("nutella")).toBeUndefined();

    vi.useRealTimers();
  });

  it("returns undefined for an unknown key", () => {
    const cache = new SearchCache<string>(5_000);

    expect(cache.get("unknown")).toBeUndefined();
  });
});
