import { Router } from "express";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compareVersions } from "../utils/version.js";

const router = Router();

const OWNER = "royai40506";
const REPO = "Roy-AI-Interface";

const pkg = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8"),
);

const CURRENT_VERSION = pkg.version;

router.get("/", async (_req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
    );

    if (!response.ok) {
      return res.status(200).json({
        updateAvailable: false,
        currentVersion: CURRENT_VERSION,
        error: "Unable to check updates",
      });
    }

    const release = await response.json();
    const latestVersion = String(release.tag_name).replace(/^v/, "");

    return res.json({
      currentVersion: CURRENT_VERSION,
      latestVersion,
      updateAvailable: compareVersions(CURRENT_VERSION, latestVersion),
      releaseName: release.name,
      publishedAt: release.published_at,
      downloadUrl: release.html_url,
    });
  } catch {
    return res.status(200).json({
      updateAvailable: false,
      currentVersion: CURRENT_VERSION,
      error: "Network error",
    });
  }
});

export default router;
