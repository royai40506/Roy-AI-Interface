import type { BrainPlanStep } from "./BrainTypes";
import { brainGoalTracker } from "./BrainGoalTracker";

export class BrainPlanner {

  create(task: string): BrainPlanStep[] {

    const goal = brainGoalTracker.getCurrent();

    const source =
      (goal?.title ?? task).trim();

    const text = source.toLowerCase();

    const descriptions: string[] = [];

    const add = (step: string) => {
      if (!descriptions.includes(step)) {
        descriptions.push(step);
      }
    };

    add("Analyze request");

    if (/camera/.test(text)) {
      add("Open Camera");
    }

    if (/whatsapp/.test(text)) {
      add("Open WhatsApp");
    }

    if (/(call|phone)/.test(text)) {
      add("Prepare phone call");
    }

    if (/(remember|memory|save)/.test(text)) {
      add("Store information in memory");
    }

    if (/(recall|load|who am i|what('?s| is)? my name)/.test(text)) {
      add("Retrieve information from memory");
    }

    if (/(image|photo|picture)/.test(text)) {
      add("Process image");
    }

    if (/(calculate|solve|reason|think)/.test(text)) {
      add("Reason about the request");
    }

    add(source || "Execute request");
    add("Verify completion");

    return descriptions.map(
      (description, index): BrainPlanStep => ({
        id: index + 1,
        description,
        completed: false,
      })
    );

  }

}

export const brainPlanner =
  new BrainPlanner();
