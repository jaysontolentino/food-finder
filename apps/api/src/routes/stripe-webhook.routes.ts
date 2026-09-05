import { Router } from "express";
import express from "express";

import { stripeWebhookController } from "../container";

const router = Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeWebhookController.handle.bind(stripeWebhookController),
);

export default router;
