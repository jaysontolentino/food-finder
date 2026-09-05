import { Router } from "express";
import { subscriptionController } from "../container";

const router = Router();

router.post(
  "/checkout",
  subscriptionController.createCheckoutSession.bind(subscriptionController),
);

router.get(
  "/",
  subscriptionController.getSubscription.bind(subscriptionController),
);

export default router;
