import { memoryStore } from "./MemoryStore";
import { memoryVectorMath } from "./MemoryVectorMath";
import type { MemoryItem } from "./MemoryTypes";

export class MemoryVectorSearch {

  search(queryVector: number[], limit = 5): MemoryItem[] {

    if (queryVector.length === 0) {
      return [];
    }

    return memoryStore
      .all()
      .filter(
        (memory) =>
          Array.isArray(memory.vector) &&
          memory.vector.length === queryVector.length
      )
      .map((memory) => ({
        memory,
        score: memoryVectorMath.cosineSimilarity(
          queryVector,
          memory.vector!
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.memory);
  }

}

export const memoryVectorSearch = new MemoryVectorSearch();
