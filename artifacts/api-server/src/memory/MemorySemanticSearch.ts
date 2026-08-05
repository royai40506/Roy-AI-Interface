import { memoryEmbeddingEngine } from "./MemoryEmbedding";
import { memoryEmbeddingStore } from "./MemoryEmbeddingStore";
import { memorySimilarity } from "./MemorySimilarity";
import type { MemoryEmbedding } from "./MemoryEmbedding";

export interface SemanticResult {
  embedding: MemoryEmbedding;
  score: number;
}

export class MemorySemanticSearch {

  search(query: string, limit = 5): SemanticResult[] {

    const queryEmbedding = memoryEmbeddingEngine.create(query);

    return memoryEmbeddingStore
      .all()
      .map(item => ({
        embedding: item,
        score: memorySimilarity.cosine(
          queryEmbedding.vector,
          item.vector
        )
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

}

export const memorySemanticSearch =
  new MemorySemanticSearch();
