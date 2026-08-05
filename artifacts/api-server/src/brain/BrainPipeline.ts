import { BrainContext } from "./BrainContext";
import type { BrainDecision } from "./BrainTypes";

export class BrainPipeline {
  analyze(context: BrainContext): BrainDecision {
    if (context.hasImage()) {
      return {
        intent: "vision",
        confidence: 1,
        reason: "Image detected",
      };
    }

    const text = context.getLastMessage().toLowerCase();

    if (text.includes("remember") || text.includes("memory")) {
      return {
        intent: "memory",
        confidence: 0.95,
        reason: "Memory keyword detected",
      };
    }

    return {
      intent: "chat",
      confidence: 0.9,
      reason: "Default conversation",
    };
  }
}
