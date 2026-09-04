import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function demoUserMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.userId = env.demoUserId;
  next();
}
