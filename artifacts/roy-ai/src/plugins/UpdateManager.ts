import { Capacitor } from "@capacitor/core";

export async function startUpdate(url: string) {
  if (!url) return;

  if (Capacitor.isNativePlatform()) {
    const { Plugins } = Capacitor as any;

    if (Plugins?.RoyDevice?.startUpdate) {
      return Plugins.RoyDevice.startUpdate({ url });
    }
  }

  window.open(url, "_blank");
}
