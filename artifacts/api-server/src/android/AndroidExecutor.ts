import { spawn } from "node:child_process";

import type { AutomationAction } from "../brain/BrainTypes";

export class AndroidExecutor {
  execute(action: AutomationAction): boolean {
    switch (action) {
      case "open_camera":
        return this.run([
          "start",
          "-a",
          "android.media.action.IMAGE_CAPTURE",
        ]);

      case "open_settings":
        return this.run([
          "start",
          "-a",
          "android.settings.SETTINGS",
        ]);

      case "open_whatsapp":
        return this.run([
          "start",
          "-n",
          "com.whatsapp.w4b/com.whatsapp.Main",
        ]);

      case "call_contact":
        return this.run([
          "start",
          "-a",
          "android.intent.action.DIAL",
        ]);

      default:
        return false;
    }
  }

  private run(args: string[]): boolean {
    try {
      const p = spawn("am", args, {
        stdio: "ignore",
        detached: true,
      });

      p.unref();
      return true;
    } catch {
      return false;
    }
  }
}

export const androidExecutor = new AndroidExecutor();
