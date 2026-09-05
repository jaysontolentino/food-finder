import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { demoUserMiddleware } from "./middleware/demo-user.middleware";

import productRoutes from "./routes/product.routes";
import searchRoutes from "./routes/search.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import stripeWebhookRoutes from "./routes/stripe-webhook.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use("/api/webhooks/stripe", stripeWebhookRoutes);

app.use(express.json());
app.use(demoUserMiddleware);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.log("Database health check failed ", error);

    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/products", productRoutes);
app.use("/api/searches", searchRoutes);
app.use("/api/subscription", subscriptionRoutes);

export default app;
