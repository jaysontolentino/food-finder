import type Stripe from "stripe";
import type { SubscriptionStatus } from "../../generated/prisma/client";

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "ACTIVE";

    case "canceled":
      return "CANCELED";

    case "past_due":
    case "unpaid":
      return "PAST_DUE";

    case "incomplete":
    case "incomplete_expired":
      return "INCOMPLETE";

    default:
      return "INCOMPLETE";
  }
}
