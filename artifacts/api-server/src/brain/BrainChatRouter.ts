import type { BrainDecision, BrainExecution } from "./BrainTypes";

export class BrainChatRouter {

  execute(
    decision: BrainDecision
  ): BrainExecution {

    return {
      success: true,
      message: "Chat request accepted.",
    };

  }

  canHandle(
    decision: BrainDecision
  ): boolean {

    return decision.intent === "chat";

  }

}

export const brainChatRouter =
  new BrainChatRouter();
