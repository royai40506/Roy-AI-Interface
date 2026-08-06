export interface UpdateInfo {
  updateAvailable: boolean;
  latestVersion?: string;
  releaseName?: string;
  publishedAt?: string;
  downloadUrl?: string;
  error?: string;
}

export async function checkForUpdates(): Promise<UpdateInfo | null> {
  try {
    const res = await fetch("http://localhost:3000/api/update");

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Update check failed:", err);
    return null;
  }
}
