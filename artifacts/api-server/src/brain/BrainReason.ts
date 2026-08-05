import type { BrainIntent } from "./BrainTypes";

export class BrainReason {

  explain(intent: BrainIntent): string {

    switch (intent) {

      case "vision":
        return "Image detected.";

      case "memory":
        return "Memory related request detected.";

      case "reasoning":
        return "Reasoning request detected.";

      case "automation":
        return "Automation request detected.";

      case "tool":
        return "Tool usage required.";

      case "system":
        return "System command detected.";

      case "chat":
        return "Normal conversation.";

      default:
        return "Unknown request.";

    }

  }

}

export const brainReason =
  new BrainReason();
