import { describe, expect, it, vi } from "vitest";
import { SubscriptionService } from "./subscription.service";

describe("SubscriptionService", () => {
  it("allows nutrition access for an active subscription", async () => {
    const subscriptionRepository = {
      findByUserId: vi.fn().mockResolvedValue({
        status: "ACTIVE",
      }),
    };

    const userRepository = {} as any;

    const service = new SubscriptionService(
      userRepository,
      subscriptionRepository as any,
    );

    await expect(service.canAccessNutrition("demo-user-id")).resolves.toBe(
      true,
    );

    expect(subscriptionRepository.findByUserId).toHaveBeenCalledWith(
      "demo-user-id",
    );
  });

  it("denies nutrition access when there is no subscription", async () => {
    const subscriptionRepository = {
      findByUserId: vi.fn().mockResolvedValue(null),
    };

    const userRepository = {} as any;

    const service = new SubscriptionService(
      userRepository,
      subscriptionRepository as any,
    );

    await expect(service.canAccessNutrition("demo-user-id")).resolves.toBe(
      false,
    );
  });

  it("denies nutrition access for a canceled subscription", async () => {
    const subscriptionRepository = {
      findByUserId: vi.fn().mockResolvedValue({
        status: "CANCELED",
      }),
    };

    const userRepository = {} as any;

    const service = new SubscriptionService(
      userRepository,
      subscriptionRepository as any,
    );

    await expect(service.canAccessNutrition("demo-user-id")).resolves.toBe(
      false,
    );
  });

  it("denies nutrition access for a past-due subscription", async () => {
    const subscriptionRepository = {
      findByUserId: vi.fn().mockResolvedValue({
        status: "PAST_DUE",
      }),
    };

    const userRepository = {} as any;

    const service = new SubscriptionService(
      userRepository,
      subscriptionRepository as any,
    );

    await expect(service.canAccessNutrition("demo-user-id")).resolves.toBe(
      false,
    );
  });
});
