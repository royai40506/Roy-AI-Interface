import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

export async function startUpdate(url: string) {
  if (!url) return;

  if (Capacitor.isNativePlatform()) {
    await Browser.open({
      url,
    });
    return;
  }

  window.open(url, "_blank");
}
