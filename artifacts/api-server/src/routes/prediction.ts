import { Router } from "express";
import { predictionEngine } from "../services/predictionEngine";

const router = Router();

router.post("/", (req, res): void => {
  const { date } = req.body;

  if (!date) {
    res.status(400).json({
      error: "Date required"
    });
    return;
  }

  const result = predictionEngine.predict(date);

  res.json(result);
  return;
});

export default router;
