import { Router } from "express";
import { marketService } from "../services/marketService";
import { backtestEngine } from "../services/backtestEngine";

const router = Router();

router.post("/", async (_req, res): Promise<void> => {
  try {
    const records = await marketService.getAll();
    const result = backtestEngine.run(records);

    res.json(result);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      error: "Backtest failed",
    });
  }
});

export default router;
