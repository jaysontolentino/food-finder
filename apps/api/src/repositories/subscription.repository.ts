import type {
  Subscription,
  SubscriptionStatus,
} from "../generated/prisma/client";

import { prisma } from "../lib/prisma";

export interface ISubscriptionRepository {
  findByUserId(userId: string): Promise<Subscription | null>;

  upsert(
    userId: string,
    data: {
      stripeSubscriptionId: string;
      stripeCustomerId: string;
      status: SubscriptionStatus;
      currentPeriodEnd: Date | null;
    },
  ): Promise<Subscription>;
}

export class SubscriptionRepository implements ISubscriptionRepository {
  async findByUserId(userId: string): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
      where: { userId },
    });
  }

  async upsert(
    userId: string,
    data: {
      stripeSubscriptionId: string;
      stripeCustomerId: string;
      status: SubscriptionStatus;
      currentPeriodEnd: Date | null;
    },
  ): Promise<Subscription> {
    return prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });
  }
}
