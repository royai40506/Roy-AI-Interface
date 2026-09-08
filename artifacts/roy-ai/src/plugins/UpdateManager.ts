import { Capacitor } from "@capacitor/core";
import { RoyDevice } from "@/lib/device-api";

export async function startUpdate(url: string) {
  if (!url) return;

  if (Capacitor.isNativePlatform()) {
    await RoyDevice.startUpdate({ url });
    return;
  }

  window.open(url, "_blank");
}
