import type { Search } from "../generated/prisma/client";

export interface SearchResponse {
  id: string;
  query: string;
  language: Search["language"];
  createdAt: Date;
}

export function toSearchResponse(search: Search): SearchResponse {
  return {
    id: search.id,
    query: search.query,
    language: search.language,
    createdAt: search.createdAt,
  };
}
