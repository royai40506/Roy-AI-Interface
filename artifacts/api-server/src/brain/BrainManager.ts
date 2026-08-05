import { BrainContext } from "./BrainContext";
import type { BrainRequest } from "./BrainTypes";

import { brainIntentAnalyzer } from "./BrainIntentAnalyzer";
import { brainDecisionBuilder } from "./BrainDecisionBuilder";
import { brainRouter } from "./BrainRouter";

import { brainMemoryRouter } from "./BrainMemoryRouter";
import { brainVisionRouter } from "./BrainVisionRouter";
import { brainChatRouter } from "./BrainChatRouter";
import { brainAutomationRouter } from "./BrainAutomationRouter";

export class BrainManager {

  decide(request: BrainRequest) {

    const context = new BrainContext(request);

    const detectedIntents =
      brainIntentAnalyzer.detectMultiple(context);

    const primaryIntent =
      detectedIntents[0] ??
      brainIntentAnalyzer.detect(context);

    const decision =
      brainDecisionBuilder.build(
        primaryIntent,
        context.getLastMessage()
      );

    decision.primaryIntent = primaryIntent;
    decision.secondaryIntents =
      detectedIntents.filter(
        (i) => i !== primaryIntent
      );

    const route =
      brainRouter.route(decision);

    return {
      decision,
      detectedIntents,
      route,
      handlers: {
        memory:
          brainMemoryRouter.canHandle(decision),
        vision:
          brainVisionRouter.canHandle(decision),
        chat:
          brainChatRouter.canHandle(decision),
        automation:
          brainAutomationRouter.canHandle(decision),
      },
    };

  }

}

export const brainManager =
  new BrainManager();
