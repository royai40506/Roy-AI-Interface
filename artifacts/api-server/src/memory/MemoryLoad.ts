import { memoryManager } from "./MemoryManager";
import type { MemoryItem } from "./MemoryTypes";

export class MemoryLoad {

  load(key: string): MemoryItem | undefined {

    const result = memoryManager.find(key);

    if (!result.memory) {
      return undefined;
    }

    result.memory.accessCount += 1;
    result.memory.lastAccessed = Date.now();

    if (
      result.memory.accessCount >= 5 ||
      (result.memory.importance ?? 1) >= 5
    ) {
      result.memory.pinned = true;
    }

    return result.memory;
  }
}

export const memoryLoad = new MemoryLoad();
