import type {
  BrainDecision,
  AutomationAction,
  BrainExecution
} from "./BrainTypes";

export class BrainAutomationRouter {

  canHandle(
    decision: BrainDecision
  ): boolean {

    return decision.intent === "automation";

  }


  execute(
    decision: BrainDecision
  ): BrainExecution {

    return {
      success: decision.action !== "unknown",
      action: decision.action,
      message:
        decision.action === "unknown"
          ? "No automation action detected."
          : `Automation action prepared: ${decision.action}`,
    };

  }

  detectActions(
    text: string
  ): AutomationAction[] {

    const actions: AutomationAction[] = [];
    const t = text.toLowerCase();

    if (t.includes("camera"))
      actions.push("open_camera");

    if (t.includes("whatsapp"))
      actions.push("open_whatsapp");

    if (t.includes("settings"))
      actions.push("open_settings");

    if (t.includes("flashlight") || t.includes("torch"))
      actions.push("flashlight_on");

    if (t.includes("call"))
      actions.push("call_contact");

    if (actions.length === 0)
      actions.push("unknown");

    return [...new Set(actions)];

  }


  detectAction(
    text: string
  ): AutomationAction {

    const t = text.toLowerCase();

    if (t.includes("camera"))
      return "open_camera";

    if (t.includes("whatsapp"))
      return "open_whatsapp";

    if (t.includes("settings"))
      return "open_settings";

    if (t.includes("flashlight") || t.includes("torch"))
      return "flashlight_on";

    if (t.includes("call"))
      return "call_contact";

    return "unknown";
  }

}

export const brainAutomationRouter =
  new BrainAutomationRouter();
