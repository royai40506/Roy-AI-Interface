import { memorySummary } from "./MemorySummary";

export class MemorySummaryTrigger {

  shouldSummarize(messages: string[]): boolean {
    return messages.length >= 20;
  }

  summarizeIfNeeded(messages: string[]): string | null {

    if (!this.shouldSummarize(messages)) {
      return null;
    }

    return memorySummary.summarize(messages);
  }

}

export const memorySummaryTrigger = new MemorySummaryTrigger();
