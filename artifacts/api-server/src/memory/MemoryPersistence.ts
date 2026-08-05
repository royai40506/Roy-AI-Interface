import { writeFileSync, readFileSync, existsSync } from "fs";
import { memoryManager } from "./MemoryManager";
import { memoryEmbeddingStore } from "./MemoryEmbeddingStore";

const FILE = "./memory-data.json";

export class MemoryPersistence {

  save() {
    writeFileSync(
      FILE,
      JSON.stringify(
        {
          memories: memoryManager.all(),
          embeddings: memoryEmbeddingStore.toJSON(),
        },
        null,
        2
      ),
      "utf8"
    );
  }

  load() {
    if (!existsSync(FILE)) return;

    const data = JSON.parse(
      readFileSync(FILE, "utf8")
    );

    if (Array.isArray(data)) {
      for (const memory of data) {
        memoryManager.add(memory);
      }
      return;
    }

    if (data?.memories) {
      for (const memory of data.memories) {
        memoryManager.add(memory);
      }
    }

    if (Array.isArray(data?.embeddings)) {
      memoryEmbeddingStore.restore(data.embeddings);
    }
  }

}

export const memoryPersistence =
  new MemoryPersistence();
