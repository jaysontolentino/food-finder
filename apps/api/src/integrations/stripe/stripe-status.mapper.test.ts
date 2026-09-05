import { describe, expect, it } from "vitest";

import { mapStripeSubscriptionStatus } from "./stripe-status.mapper";

describe("mapStripeSubscriptionStatus", () => {
  it("maps active to ACTIVE", () => {
    expect(mapStripeSubscriptionStatus("active")).toBe("ACTIVE");
  });

  it("maps trialing to ACTIVE", () => {
    expect(mapStripeSubscriptionStatus("trialing")).toBe("ACTIVE");
  });

  it("maps canceled to CANCELED", () => {
    expect(mapStripeSubscriptionStatus("canceled")).toBe("CANCELED");
  });

  it("maps past_due to PAST_DUE", () => {
    expect(mapStripeSubscriptionStatus("past_due")).toBe("PAST_DUE");
  });

  it("maps unpaid to PAST_DUE", () => {
    expect(mapStripeSubscriptionStatus("unpaid")).toBe("PAST_DUE");
  });

  it("maps incomplete to INCOMPLETE", () => {
    expect(mapStripeSubscriptionStatus("incomplete")).toBe("INCOMPLETE");
  });

  it("maps incomplete_expired to INCOMPLETE", () => {
    expect(mapStripeSubscriptionStatus("incomplete_expired")).toBe(
      "INCOMPLETE",
    );
  });
});
