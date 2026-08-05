import { memoryManager } from "./MemoryManager";
import { memoryEmbeddingEngine } from "./MemoryEmbedding";
import { memoryEmbeddingStore } from "./MemoryEmbeddingStore";
import type { MemoryItem } from "./MemoryTypes";

export class MemorySave {
  save(
    category: string,
    key: string,
    value: string
  ): MemoryItem {

    const now = Date.now();

    const memory: MemoryItem = {
      id: now.toString(),

      category,
      key,
      value,

      createdAt: now,
      updatedAt: now,

      accessCount: 0,
      lastAccessed: now,

      importance: 1,
      pinned: false,

      // Vector Memory (placeholder)
      vector: [],
      embeddingModel: "pending"
    };

    memoryManager.add(memory);

    const embedding = memoryEmbeddingEngine.create(
      `${category}:${key}:${value}`
    );

    memoryEmbeddingStore.save(embedding);

    void memoryEmbeddingEngine
      .createAsync(`${category}:${key}:${value}`)
      .then((realEmbedding) => {
        memoryEmbeddingStore.save(realEmbedding);
        memory.vector = realEmbedding.vector;
        memory.embeddingModel = realEmbedding.model;
      })
      .catch((err) => {
        console.error("[MEMORY EMBEDDING]", err);
      });

    return memory;
  }
}

export const memorySave = new MemorySave();
