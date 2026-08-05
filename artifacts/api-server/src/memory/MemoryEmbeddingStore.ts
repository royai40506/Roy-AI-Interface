import type { MemoryEmbedding } from "./MemoryEmbedding";

export class MemoryEmbeddingStore {

  private embeddings = new Map<string, MemoryEmbedding>();

  save(embedding: MemoryEmbedding): void {
    this.embeddings.set(embedding.key, embedding);
  }

  load(key: string): MemoryEmbedding | undefined {
    return this.embeddings.get(key);
  }

  all(): MemoryEmbedding[] {
    return [...this.embeddings.values()];
  }

  clear(): void {
    this.embeddings.clear();
  }

  toJSON(): MemoryEmbedding[] {
    return this.all();
  }

  restore(items: MemoryEmbedding[]): void {
    this.clear();
    for (const item of items) {
      this.save(item);
    }
  }

}

export const memoryEmbeddingStore = new MemoryEmbeddingStore();
