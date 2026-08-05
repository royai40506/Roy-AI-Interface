import type { BrainDecision } from "./BrainTypes";

export class BrainRouter {

  route(decision: BrainDecision): string {

    switch (decision.intent) {

      case "memory":
        return "memory";

      case "vision":
        return "vision";

      case "reasoning":
        return "reasoning";

      case "automation":
        return "automation";

      case "tool":
        return "tool";

      case "system":
        return "system";

      case "chat":
      default:
        return "chat";

    }

  }

}

export const brainRouter =
  new BrainRouter();
