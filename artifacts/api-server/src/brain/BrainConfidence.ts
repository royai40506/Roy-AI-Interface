import type { BrainIntent } from "./BrainTypes";

export class BrainConfidence {

  score(intent: BrainIntent): number {

    switch (intent) {

      case "vision":
        return 0.98;

      case "memory":
        return 0.95;

      case "reasoning":
        return 0.92;

      case "automation":
        return 0.90;

      case "tool":
        return 0.88;

      case "system":
        return 0.85;

      case "chat":
        return 0.80;

      default:
        return 0.50;

    }

  }

}

export const brainConfidence =
  new BrainConfidence();
