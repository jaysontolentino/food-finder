import type { Request, Response } from "express";
import Stripe from "stripe";

import { env } from "../config/env";
import type { SubscriptionService } from "../services/subscription.service";
import { stripe } from "../integrations/stripe/stripe.client";

export class StripeWebhookController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async handle(req: Request, res: Response) {
    if (!env.stripeWebhookSecret) {
      return res.status(500).json({
        error: "Stripe webhook secret is not configured",
      });
    }

    const signature = req.headers["stripe-signature"];

    if (!signature || Array.isArray(signature)) {
      return res.status(400).json({
        error: "Missing Stripe signature",
      });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        env.stripeWebhookSecret,
      );
    } catch (error) {
      console.error("Invalid Stripe webhook signature:", error);

      return res.status(400).json({
        error: "Invalid webhook signature",
      });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;

          if (session.subscription) {
            const subscriptionId =
              typeof session.subscription === "string"
                ? session.subscription
                : session.subscription.id;

            const subscription =
              await stripe.subscriptions.retrieve(subscriptionId);

            const userId = session.metadata?.userId;

            if (userId) {
              await this.subscriptionService.syncStripeSubscription(
                userId,
                subscription,
              );
            }
          }

          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object;

          await this.subscriptionService.handleStripeSubscription(subscription);

          break;
        }
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("Failed to process Stripe webhook:", error);

      return res.status(500).json({
        error: "Failed to process webhook",
      });
    }
  }
}
