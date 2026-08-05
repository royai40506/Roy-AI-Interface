export interface BrainGoal {
  id: string;
  title: string;
  active: boolean;
}

export class BrainGoalTracker {
  private currentGoal?: BrainGoal;

  update(task: string): void {
    const title = task.trim();

    if (!title) return;

    this.currentGoal = {
      id: "goal-main",
      title,
      active: true,
    };
  }

  getCurrent(): BrainGoal | undefined {
    return this.currentGoal;
  }

  setCurrent(goal: BrainGoal): void {
    this.currentGoal = goal;
  }

  clear(): void {
    this.currentGoal = undefined;
  }
}

export const brainGoalTracker =
  new BrainGoalTracker();
