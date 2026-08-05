import { memoryStore } from "./MemoryStore";
import { memorySearch } from "./MemorySearch";
import { memoryPersistence } from "./MemoryPersistence";
import type {
  MemoryItem,
  MemorySearchResult
} from "./MemoryTypes";

export class MemoryManager {

  add(memory: MemoryItem): void {

    const existing = this.find(memory.key);

    if (existing.found && existing.memory) {
      existing.memory.value = memory.value;
      existing.memory.updatedAt = Date.now();
      existing.memory.importance =
        (existing.memory.importance ?? 1) + 1;
      return;
    }

    memoryStore.add(memory);
    memoryPersistence.save();
  }

  find(key: string): MemorySearchResult {
    return memorySearch.find(key);
  }

  all(): MemoryItem[] {
    return memoryStore.all();
  }

  clear(): void {
    memoryStore.clear();
  }
}

export const memoryManager = new MemoryManager();
