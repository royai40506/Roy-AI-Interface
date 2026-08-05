import { memorySave } from "./MemorySave";
import { memoryLoad } from "./MemoryLoad";
import { memoryExtractor } from "./MemoryExtractor";
import { memorySemanticSearch } from "./MemorySemanticSearch";
import { memorySummaryTrigger } from "./MemorySummaryTrigger";
import type { MemoryItem } from "./MemoryTypes";

export class MemoryService {

  save(category: string, key: string, value: string): MemoryItem {
    return memorySave.save(category, key, value);
  }

  extract(text: string) {
    return memoryExtractor.extract(text);
  }

  load(key: string): MemoryItem | undefined {
    return memoryLoad.load(key);
  }

  summarize(messages: string[]): string | null {

    const summary =
      memorySummaryTrigger.summarizeIfNeeded(messages);

    if (!summary) {
      return null;
    }

    this.save(
      "summary",
      `summary-${Date.now()}`,
      summary
    );

    return summary;
  }


  semanticSearch(query: string, limit = 5) {
    return memorySemanticSearch.search(query, limit);
  }

}
export const memoryService = new MemoryService();
