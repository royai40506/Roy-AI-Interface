import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    version: "1.0.0",
    tag: "v1.0-foundation",
    build: "7f50c5c",
    updateChannel: "stable"
  });
});

export default router;
