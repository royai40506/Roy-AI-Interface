import type { BrainDecision, BrainExecution } from "./BrainTypes";
import { visionService } from "../vision";

export class BrainVisionRouter {
  execute(
    decision: BrainDecision,
    image?: string,
    language: string = "en"
  ): BrainExecution {
    void visionService.analyze({
      image: image ?? "",
      prompt: decision.reason,
      language,
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
