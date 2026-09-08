import { Router } from "express";
import { predictionEngine } from "../services/predictionEngine";

const router = Router();

router.post("/", async (req, res): Promise<void> => {
  const { date } = req.body;

  if (!date) {
    res.status(400).json({
      error: "Date required",
    });
    return;
  }

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({
      error: "Invalid date format",
    });
    return;
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    res.status(400).json({
      error: "Invalid date",
    });
    return;
  }

  try {
    const result = await predictionEngine.predict(date);
    res.json(result);
    return;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Insufficient historical data for prediction"
    ) {
      res.status(422).json({
        error: error.message,
      });
      return;
    }

    throw error;
  }
});

export default router;
