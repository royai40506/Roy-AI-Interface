import { memoryService } from "../memory/index";
import type { BrainDecision, BrainExecution } from "./BrainTypes";

export class BrainMemoryRouter {


  execute(
    decision: BrainDecision
  ): BrainExecution {

    const results = memoryService.semanticSearch(
      decision.query ?? decision.reason,
      3
    );

    return {
      success: true,
      message: `Memory search completed (${results.length} matches).`,
    };

  }

  canHandle(
    decision: BrainDecision
  ): boolean {

    return decision.intent === "memory";

  }

}

export const brainMemoryRouter =
  new BrainMemoryRouter();
