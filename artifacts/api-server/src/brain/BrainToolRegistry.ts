import type { AutomationAction } from "./BrainTypes";

export class BrainToolRegistry {

  private readonly supportedActions = new Set<AutomationAction>([
    "open_camera",
    "open_whatsapp",
    "open_settings",
    "call_contact",
    "flashlight_on"
  ]);

  has(action: AutomationAction): boolean {
    return this.supportedActions.has(action);
  }

  list(): AutomationAction[] {
    return [...this.supportedActions];
  }

}

export const brainToolRegistry =
  new BrainToolRegistry();
