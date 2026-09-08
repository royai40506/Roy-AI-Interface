import { Router } from "express";
import { marketService } from "../services/marketService";

const router = Router();

router.get("/", async (_req, res): Promise<void> => {
  try {
    const records = await marketService.getAll();
    res.json(records);
  } catch (error) {
    console.error("Failed to fetch market records:", error);
    res.status(500).json({ error: "Failed to fetch market records" });
  }
});

router.get("/:date", async (req, res): Promise<void> => {
  try {
    const record = await marketService.getByDate(req.params.date);

    if (!record) {
      res.status(404).json({ error: "Market record not found" });
      return;
    }

    res.json(record);
  } catch (error) {
    console.error("Failed to fetch market record:", error);
    res.status(500).json({ error: "Failed to fetch market record" });
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const record = await marketService.upsert(req.body);
    res.status(200).json(record);
  } catch (error) {
    console.error("Failed to save market record:", error);
    res.status(400).json({
      error: "Invalid market record",
    });
  }
});

router.delete("/:date", async (req, res): Promise<void> => {
  try {
    const record = await marketService.deleteByDate(req.params.date);

    if (!record) {
      res.status(404).json({ error: "Market record not found" });
      return;
    }

    res.json(record);
  } catch (error) {
    console.error("Failed to delete market record:", error);
    res.status(500).json({ error: "Failed to delete market record" });
  }
});

export default router;
