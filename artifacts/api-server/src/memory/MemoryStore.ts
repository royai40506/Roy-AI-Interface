import type { MemoryItem } from "./MemoryTypes";

export class MemoryStore {

  private memories: MemoryItem[] = [];

  all(): MemoryItem[] {
    return this.memories;
  }

  add(memory: MemoryItem): void {
    this.memories.push(memory);
  }

  clear(): void {
    this.memories = [];
  }

}

export const memoryStore =
  new MemoryStore();
