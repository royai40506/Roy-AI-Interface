import { brainManager } from "./BrainManager";
import { brainToolDispatcher } from "./BrainToolDispatcher";
import { brainPlanner } from "./BrainPlanner";
import { brainReflectionEngine } from "./BrainReflection";
import { brainConversationState } from "./BrainConversationState";
import { brainGoalTracker } from "./BrainGoalTracker";
import { brainAutomationRouter } from "./BrainAutomationRouter";
import { brainMemoryRouter } from "./BrainMemoryRouter";
import { brainVisionRouter } from "./BrainVisionRouter";
import type { BrainRequest } from "./BrainTypes";

export class BrainExecutionPipeline {

  execute(request: BrainRequest) {

    brainConversationState.update(request.messages);

    brainGoalTracker.update(
      request.messages[request.messages.length - 1]?.content ?? ""
    );

    const result = brainManager.decide(request);

    const latestMessage =
      request.messages[request.messages.length - 1]?.content ?? "";

    if (latestMessage.trim()) {
      brainGoalTracker.setCurrent({
        id: "goal-main",
        title: latestMessage.trim(),
        active: true,
      });
    }

    const execution =
      result.decision.intent === "automation"
        ? brainAutomationRouter.execute(result.decision)
        : result.decision.intent === "memory"
        ? brainMemoryRouter.execute(result.decision)
        : result.decision.intent === "vision"
        ? brainVisionRouter.execute(result.decision)
        : undefined;

    const dispatcherExecution =
      result.decision.intent === "automation"
        ? brainToolDispatcher.dispatch(
            result.decision.action ?? "unknown"
          )
        : undefined;

    const dispatcherExecutions =
      result.decision.intent === "automation"
        ? brainToolDispatcher.dispatchMultiple(
            result.decision.actions ??
            [result.decision.action ?? "unknown"]
          )
        : [];

    const plan =
      result.decision.intent === "reasoning"
        ? brainPlanner.create(
            request.messages[request.messages.length - 1]?.content ?? ""
          )
        : undefined;

    const reflection = brainReflectionEngine.analyze(
      result.decision,
      execution ?? dispatcherExecution,
      plan,
    );

    return {
      success: true,
      timestamp: Date.now(),
      ...result,
      execution: execution ?? dispatcherExecution,
      executions:
        dispatcherExecutions.length > 0
          ? dispatcherExecutions
          : execution
            ? [execution]
            : [],
      plan,
      reflection,
      goal: brainGoalTracker.getCurrent(),
      handledIntents: [
        result.decision.primaryIntent ?? result.decision.intent,
        ...(result.decision.secondaryIntents ?? []),
      ]
    };

  }

}

export const brainExecutionPipeline =
  new BrainExecutionPipeline();
