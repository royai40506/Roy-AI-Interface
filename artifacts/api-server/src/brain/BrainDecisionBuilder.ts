import type {
  BrainDecision,
  BrainIntent,
} from "./BrainTypes";

import { brainAutomationRouter } from "./BrainAutomationRouter";
import { brainConfidence } from "./BrainConfidence";
import { brainReason } from "./BrainReason";

export class BrainDecisionBuilder {

  build(
    intent: BrainIntent,
    lastMessage: string
  ): BrainDecision {

    const decision: BrainDecision = {
      intent,
      primaryIntent: intent,
      secondaryIntents: [],
      priority: this.getPriority(intent),
      confidence: brainConfidence.score(intent),
      reason: brainReason.explain(intent),
      query: lastMessage,
    };

    if (intent === "automation") {

      decision.actions =
        brainAutomationRouter.detectActions(
          lastMessage
        );

      decision.action =
        decision.actions[0];

    }

    return decision;

  }

  private getPriority(
    intent: BrainIntent
  ): number {

    switch (intent) {
      case "system":
        return 100;

      case "automation":
        return 90;

      case "vision":
        return 80;

      case "reasoning":
        return 70;

      case "memory":
        return 60;

      case "tool":
        return 50;

      case "chat":
        return 40;

      default:
        return 0;
    }

  }

  private getConfidence(
    intent: BrainIntent
  ): number {

    switch (intent) {
      case "automation":
      case "vision":
      case "memory":
        return 0.95;

      case "reasoning":
        return 0.90;

      case "chat":
        return 0.80;

      default:
        return 0.50;
    }

  }

}

export const brainDecisionBuilder =
  new BrainDecisionBuilder();
