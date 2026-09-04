import type { ISearchRepository } from "../repositories/search.repository";
import { toSearchResponse, type SearchResponse } from "./search-response";

export class SearchService {
  constructor(private readonly searchRepository: ISearchRepository) {}

  async getRecentSearches(
    userId: string,
    limit = 10,
  ): Promise<SearchResponse[]> {
    const searches = await this.searchRepository.findRecentByUser(
      userId,
      limit,
    );

    return searches.map(toSearchResponse);
  }
}
