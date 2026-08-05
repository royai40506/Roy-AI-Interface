import { BrainContext } from "./BrainContext";
import type { BrainIntent } from "./BrainTypes";

export class BrainIntentAnalyzer {

  detect(context: BrainContext): BrainIntent {

    if (context.hasImage()) {
      return "vision";
    }

    const last =
      context.getLastMessage().toLowerCase();

    const previous =
      context.getPreviousMessage().toLowerCase();

    const conversation =
      context.getConversationText().toLowerCase();

    if (
      /\bremember\b|\bmemory\b|my name|who am i/i.test(conversation)
    ) {
      return "memory";
    }

    if (
      /(camera|whatsapp|settings|flashlight|torch|call)/i.test(last)
    ) {
      return "automation";
    }

    if (
      /(why|how|solve|reason|explain|compare|analyse|analyze)/i.test(last)
    ) {
      return "reasoning";
    }

    if (
      /^(yes|yeah|ok|okay|continue|do it|again|haan|ha|kar|phir|repeat)$/i.test(last) &&
      previous.length > 0
    ) {
      if (
        /(camera|whatsapp|settings|flashlight|torch|call)/i.test(previous)
      ) {
        return "automation";
      }

      if (
        /(why|how|solve|reason|explain|compare|analyse|analyze)/i.test(previous)
      ) {
        return "reasoning";
      }
    }

    return "chat";
  }


  detectMultiple(context: BrainContext): BrainIntent[] {

    const intents: BrainIntent[] = [];
    const text = context.getConversationText().toLowerCase();

    if (context.hasImage()) {
      intents.push("vision");
    }

    if (/\bremember\b|\bmemory\b|my name|who am i/i.test(text)) {
      intents.push("memory");
    }

    if (/(camera|whatsapp|settings|flashlight|torch|call)/i.test(text)) {
      intents.push("automation");
    }

    if (/(why|how|solve|reason|explain|compare|analyse|analyze)/i.test(text)) {
      intents.push("reasoning");
    }

    if (intents.length === 0) {
      intents.push("chat");
    }

    return [...new Set(intents)];

  }

}

export const brainIntentAnalyzer =
  new BrainIntentAnalyzer();
