import { memoryManager } from "./MemoryManager";

export class LongTermMemory {

  saveAll() {
    return memoryManager.all();
  }

  restore(memories: any[]) {
    for (const memory of memories) {
      memoryManager.add(memory);
    }
  }

}

export const longTermMemory =
  new LongTermMemory();
