import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

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

export default app;
