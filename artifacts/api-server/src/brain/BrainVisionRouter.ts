import type { BrainDecision, BrainExecution } from "./BrainTypes";
import { visionService } from "../vision";

export class BrainVisionRouter {


  execute(
    decision: BrainDecision
  ): BrainExecution {

    void visionService.analyze({
      image: decision.image ?? "",
      prompt: decision.reason,
      language: "en",
    });

    return {
      success: true,
      message: "Vision pipeline started.",
    };

  }

  canHandle(
    decision: BrainDecision
  ): boolean {

    return decision.intent === "vision";

  }

}

export const brainVisionRouter =
  new BrainVisionRouter();
