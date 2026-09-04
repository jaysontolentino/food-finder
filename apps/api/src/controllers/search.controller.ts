import type { Request, Response } from "express";
import type { SearchService } from "../services/search.service";

export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  async getRecent(req: Request, res: Response) {
    const rawLimit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), 50)
      : 10;

    const searches = await this.searchService.getRecentSearches(
      req.userId,
      limit,
    );

    return res.json({
      searches,
    });
  }
}
