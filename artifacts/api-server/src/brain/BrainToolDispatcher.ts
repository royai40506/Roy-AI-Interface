import type {
  AutomationAction,
  BrainExecution
} from "./BrainTypes";

import { brainToolRegistry } from "./BrainToolRegistry";
import { androidExecutor } from "../android/AndroidExecutor";

export class BrainToolDispatcher {

  dispatch(action: AutomationAction): BrainExecution {

    if (action === "unknown") {
      return {
        success: false,
        action,
        message: "No matching automation action found."
      };
    }

    if (!brainToolRegistry.has(action)) {
      return {
        success: false,
        action,
        message: "Automation tool is not registered."
      };
    }

    const executed = androidExecutor.execute(action);

    return {
      success: executed,
      action,
      message: executed
        ? `Executed: ${action}`
        : `Execution failed: ${action}`
    };

  }


  dispatchMultiple(actions: AutomationAction[]): BrainExecution[] {

    const results: BrainExecution[] = [];

    for (const action of actions) {
      results.push(this.dispatch(action));
    }

    return results;

  }


}

export const brainToolDispatcher =
  new BrainToolDispatcher();
