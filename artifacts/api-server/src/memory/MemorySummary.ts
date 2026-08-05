export class MemorySummary {

  summarize(messages: string[]): string {

    if (messages.length === 0) {
      return "";
    }

    if (messages.length <= 5) {
      return messages.join(" ");
    }

    const first = messages.slice(0, 3);
    const middle = messages.length - 6;
    const last = messages.slice(-3);

    return [
      ...first,
      `... (${middle} messages omitted) ...`,
      ...last,
    ].join(" ");
  }

}

export const memorySummary = new MemorySummary();
