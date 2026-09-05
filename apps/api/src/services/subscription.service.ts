import type Stripe from "stripe";
import { stripe } from "../integrations/stripe/stripe.client";
import type { IUserRepository } from "../repositories/user.repository";
import type { ISubscriptionRepository } from "../repositories/subscription.repository";
import { mapStripeSubscriptionStatus } from "../integrations/stripe/stripe-status.mapper";
import { env } from "../config/env.js";

export class SubscriptionService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async createCheckoutSession(userId: string) {
    if (!env.stripePriceId) {
      throw new Error("STRIPE_PRICE_ID is not configured");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await this.userRepository.updateStripeCustomerId(
        user.id,
        stripeCustomerId,
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price: env.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      success_url: "http://localhost:3000/?subscription=success",
      cancel_url: "http://localhost:3000/?subscription=canceled",
    });

    return {
      url: session.url,
    };
  }

  async canAccessNutrition(userId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findByUserId(userId);

    return subscription?.status === "ACTIVE";
  }

  async syncStripeSubscription(
    userId: string,
    subscription: Stripe.Subscription,
  ) {
    const status = mapStripeSubscriptionStatus(subscription.status);

    const currentPeriodEnd = subscription.items.data[0]?.current_period_end
      ? new Date(subscription.items.data[0].current_period_end * 1000)
      : null;

    return this.subscriptionRepository.upsert(userId, {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status,
      currentPeriodEnd,
    });
  }

  async handleStripeSubscription(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;

    if (userId) {
      return this.syncStripeSubscription(userId, subscription);
    }

    const stripeCustomerId = subscription.customer as string;

    const user =
      await this.userRepository.findByStripeCustomerId(stripeCustomerId);

    if (!user) {
      throw new Error(`User not found for Stripe customer ${stripeCustomerId}`);
    }

    return this.syncStripeSubscription(user.id, subscription);
  }
}
