export interface UpdateInfo {
  updateAvailable: boolean;
  latestVersion?: string;
  releaseName?: string;
  publishedAt?: string;
  downloadUrl?: string;
}

import pkg from "../../package.json";

const CURRENT_VERSION = pkg.version;


export async function checkForUpdates(): Promise<UpdateInfo | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/royai40506/Roy-AI-Interface/releases/latest"
    );

    if (!res.ok) return null;

    const release = await res.json();

    const tagVersion = String(release.tag_name || "")
      .replace(/^v/, "")
      .trim();

    const bodyVersionMatch = String(release.body || "").match(
      /version\s*=\s*([0-9]+(?:\.[0-9]+)*)/i
    );

    const latest = (
      bodyVersionMatch?.[1] ||
      (tagVersion !== "latest" ? tagVersion : "")
    ).trim();

    const apk = (release.assets || []).find((a: any) =>
      String(a.name || "").toLowerCase().endsWith(".apk")
    );

    const normalize = (version: string) =>
      version
        .replace(/^v/, "")
        .split(".")
        .map((part) => Number(part) || 0);

    const currentParts = normalize(CURRENT_VERSION);
    const latestParts = normalize(latest);

    let updateAvailable = false;

    if (latest) {
      const length = Math.max(currentParts.length, latestParts.length);

      for (let i = 0; i < length; i++) {
        const current = currentParts[i] || 0;
        const incoming = latestParts[i] || 0;

        if (incoming > current) {
          updateAvailable = true;
          break;
        }

        if (incoming < current) {
          break;
        }
      }
    }

    return {
      updateAvailable,
      latestVersion: latest || undefined,
      releaseName: release.name,
      publishedAt: release.published_at,
      downloadUrl: apk?.browser_download_url,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
