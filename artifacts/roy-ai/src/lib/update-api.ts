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

    const latest = (release.tag_name || "").replace(/^v/, "");

    const apk = (release.assets || []).find((a: any) =>
      a.name.toLowerCase().endsWith(".apk")
    );

    return {
      updateAvailable: latest !== CURRENT_VERSION,
      latestVersion: latest,
      releaseName: release.name,
      publishedAt: release.published_at,
      downloadUrl: apk?.browser_download_url,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
