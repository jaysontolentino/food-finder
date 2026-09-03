import type { Language } from "../generated/prisma/client";

import { prisma } from "../lib/prisma";

export interface ISearchRepository {
  create(userId: string, query: string, language: Language): Promise<unknown>;
  findRecentByUser(userId: string, limit?: number): Promise<unknown>;
}

export class SearchRepository implements ISearchRepository {
  async create(userId: string, query: string, language: Language) {
    return prisma.search.create({
      data: {
        userId,
        query,
        language,
      },
    });
  }

  async findRecentByUser(userId: string, limit = 10) {
    return prisma.search.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }
}
