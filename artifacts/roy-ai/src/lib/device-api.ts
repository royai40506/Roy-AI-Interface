import { registerPlugin } from "@capacitor/core";

export interface RoyDevicePlugin {
  ping(): Promise<void>;

  openCamera(): Promise<{ success: boolean; action: string }>;
  openSettings(): Promise<{ success: boolean; action: string }>;
  openWhatsApp(): Promise<{ success: boolean; action: string }>;
  flashlightOn(): Promise<{ success: boolean; action: string }>;
  callContact(): Promise<{ success: boolean; action: string }>;
  startUpdate(url: string): Promise<{ success: boolean; action: string }>;
}

export const RoyDevice =
  registerPlugin<RoyDevicePlugin>("RoyDevice");

export async function executeDeviceAction(
  action: string,
  payload?: any,
) {
  switch (action) {
    case "open_camera":
      return RoyDevice.openCamera();

    case "open_settings":
      return RoyDevice.openSettings();

    case "open_whatsapp":
      return RoyDevice.openWhatsApp();

    case "flashlight_on":
      return RoyDevice.flashlightOn();

    case "call_contact":
      return RoyDevice.callContact();

    case "start_update":
      return RoyDevice.startUpdate(payload?.url ?? "");

    default:
      console.warn("Unknown device action:", action);
      return {
        success: false,
        action,
      };
  }
}
