export function compareVersions(current: string, latest: string): boolean {
  const c = current.replace(/^v/, "").split(".").map(Number);
  const l = latest.replace(/^v/, "").split(".").map(Number);

  const len = Math.max(c.length, l.length);

  for (let i = 0; i < len; i++) {
    const cv = c[i] || 0;
    const lv = l[i] || 0;

    if (lv > cv) return true;
    if (lv < cv) return false;
  }

  return false;
}
