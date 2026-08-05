import type {
  BrainDecision,
  BrainExecution,
  BrainPlanStep,
  BrainReflection,
} from "./BrainTypes";
import { brainGoalTracker } from "./BrainGoalTracker";

export class BrainReflectionEngine {

  analyze(
    decision: BrainDecision,
    execution?: BrainExecution,
    plan?: BrainPlanStep[],
  ): BrainReflection {

    const notes: string[] = [];

    notes.push(`intent=${decision.intent}`);
    notes.push(`confidence=${decision.confidence}`);

    if (plan) {
      notes.push(`plan_steps=${plan.length}`);
    } else {
      notes.push("plan_steps=0");
    }

    if (execution) {
      notes.push(
        execution.success
          ? "execution=success"
          : "execution=failed"
      );
    } else {
      notes.push("execution=none");
    }

    const currentGoal = brainGoalTracker.getCurrent();

    if (currentGoal && decision.confidence >= 0.7) {
      brainGoalTracker.setCurrent({
        ...currentGoal,
        active: false,
      });
    }

    return {
      score: decision.confidence,
      complete:
        decision.confidence >= 0.7 &&
        (execution ? execution.success : true),
      needsFollowUp:
        decision.confidence < 0.5 ||
        (execution ? !execution.success : false),
      usedMemory: decision.intent === "memory",
      usedVision: decision.intent === "vision",
      usedAutomation: execution !== undefined,
      notes,
    };

  }

}

export const brainReflectionEngine =
  new BrainReflectionEngine();
