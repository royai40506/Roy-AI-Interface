import { memoryManager } from "./MemoryManager";
import { memorySemanticSearch } from "./MemorySemanticSearch";
import { memoryRanking } from "./MemoryRanking";

export class MemoryHybridSearch {

  search(query: string, limit = 5) {

    const keyword = memoryManager.find(query);

    const semantic = memorySemanticSearch.search(query, limit);

    const ranked = memoryRanking.rank(
      semantic.map((item) => ({
        memory: {
          id: item.embedding.key,
          category: "semantic",
          key: item.embedding.key,
          value: item.embedding.text,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          accessCount: 0,
          lastAccessed: Date.now(),
          importance: 1,
        },
        score: item.score,
      })),
      limit
    );

    return {
      keyword,
      semantic,
      ranked,
    };
  }

}

export const memoryHybridSearch =
  new MemoryHybridSearch();
