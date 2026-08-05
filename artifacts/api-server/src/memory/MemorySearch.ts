import { memoryStore } from "./MemoryStore";
import type {
  MemoryItem,
  MemorySearchResult
} from "./MemoryTypes";

export class MemorySearch {

  private score(memory: MemoryItem): number {
    return (
      (memory.importance ?? 1) * 100 +
      memory.accessCount +
      (memory.pinned ? 1000 : 0)
    );
  }

  find(key: string): MemorySearchResult {

    const candidates = memoryStore
      .all()
      .filter(
        (m: MemoryItem) =>
          m.key.toLowerCase() === key.toLowerCase()
      );

    if (candidates.length === 0) {
      return {
        found: false
      };
    }

    candidates.sort(
      (a, b) => this.score(b) - this.score(a)
    );

    return {
      found: true,
      memory: candidates[0]
    };
  }
}

export const memorySearch = new MemorySearch();
