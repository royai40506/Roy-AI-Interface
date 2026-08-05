import { brainGoalTracker } from "./BrainGoalTracker";
import type { BrainMessage } from "./BrainTypes";

export class BrainConversationState {
  private history: BrainMessage[] = [];

  update(messages: BrainMessage[]): void {
    this.history = [...messages];
  }

  latest(): BrainMessage | undefined {
    return this.history[this.history.length - 1];
  }

  previous(): BrainMessage | undefined {
    return this.history.length > 1
      ? this.history[this.history.length - 2]
      : undefined;
  }

  all(): BrainMessage[] {
    return [...this.history];
  }

  size(): number {
    return this.history.length;
  }
}

export const brainConversationState =
  new BrainConversationState();
