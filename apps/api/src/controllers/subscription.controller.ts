import type { Request, Response } from "express";
import type { SubscriptionService } from "../services/subscription.service";
import { SupportedLanguage } from "@food-finder/shared";

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async createCheckoutSession(req: Request, res: Response) {
    const language = (
      typeof req.query.lang === "string" ? req.query.lang : "en"
    ) as SupportedLanguage;

    try {
      const session = await this.subscriptionService.createCheckoutSession(
        req.userId,
        language,
      );

      return res.json(session);
    } catch (error) {
      console.error("Failed to create checkout session:", error);

      return res.status(500).json({
        error: "Failed to create checkout session",
      });
    }
  }

  async getSubscription(req: Request, res: Response) {
    const canAccessNutrition =
      await this.subscriptionService.canAccessNutrition(req.userId);

    return res.json({
      active: canAccessNutrition,
    });
  }
}
