export interface VersionInfo {
  version: string;
  tag: string;
  build: string;
  updateChannel: string;
}

export async function getServerVersion(): Promise<VersionInfo | null> {
  try {
    const res = await fetch("/api/version");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
