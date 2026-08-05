import type {
  BrainMessage,
  BrainRequest,
} from "./BrainTypes";

export class BrainContext {

  constructor(
    private readonly request: BrainRequest
  ) {}

  get messages(): BrainMessage[] {
    return this.request.messages;
  }

  get language() {
    return this.request.language;
  }

  get image() {
    return this.request.image;
  }

  hasImage(): boolean {
    return !!this.request.image;
  }

  getLastMessage(): string {
    const last =
      this.request.messages[
        this.request.messages.length - 1
      ];

    return last?.content ?? "";
  }

  getPreviousMessage(): string {
    const previous =
      this.request.messages[
        this.request.messages.length - 2
      ];

    return previous?.content ?? "";
  }

  getConversationText(): string {
    return this.request.messages
      .map((m) => m.content)
      .join("\n");
  }

  messageCount(): number {
    return this.request.messages.length;
  }

}
