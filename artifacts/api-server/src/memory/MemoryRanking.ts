import type { MemoryItem } from "./MemoryTypes";

export class MemoryRanking {

  rank(
    results: Array<{ memory: MemoryItem; score: number }>,
    limit = 5
  ) {
    return [...results]
      .sort((a, b) => {
        const scoreA =
          a.score +
          (a.memory.importance ?? 1) * 10 +
          a.memory.accessCount +
          (a.memory.pinned ? 100 : 0);

        const scoreB =
          b.score +
          (b.memory.importance ?? 1) * 10 +
          b.memory.accessCount +
          (b.memory.pinned ? 100 : 0);

        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

}

export const memoryRanking =
  new MemoryRanking();
