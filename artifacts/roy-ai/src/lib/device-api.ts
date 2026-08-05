import { registerPlugin } from "@capacitor/core";

export interface RoyDevicePlugin {
  ping(): Promise<void>;

  openCamera(): Promise<{
    success: boolean;
    action: string;
  }>;

  openSettings(): Promise<{
    success: boolean;
    action: string;
  }>;

  openWhatsApp(): Promise<{
    success: boolean;
    action: string;
  }>;

  flashlightOn(): Promise<{
    success: boolean;
    action: string;
  }>;

  callContact(): Promise<{
    success: boolean;
    action: string;
  }>;
}

export const RoyDevice =
  registerPlugin<RoyDevicePlugin>("RoyDevice");
