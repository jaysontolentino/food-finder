import { Router } from "express";

import { SearchRepository } from "../repositories/search.repository";
import { toSearchResponse } from "../services/search-response";

const router = Router();

const searchRepository = new SearchRepository();

router.get("/recent", async (req, res) => {
  const userId = process.env.DEMO_USER_ID;

  if (!userId) {
    return res.status(500).json({
      error: "Demo user is not configured",
    });
  }

  const limitParam =
    typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

  const limit =
    Number.isInteger(limitParam) && limitParam > 0
      ? Math.min(limitParam, 50)
      : 10;

  try {
    const searches = await searchRepository.findRecentByUser(userId, limit);

    return res.json({
      searches: searches.map(toSearchResponse),
    });
  } catch (error) {
    console.error("Failed to retrieve recent searches:", error);

    return res.status(500).json({
      error: "Failed to retrieve recent searches",
    });
  }
});

export default router;
