import { Router } from "express";
import { predictionEngine } from "../services/predictionEngine";

const router = Router();

router.post("/", (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({
      error: "Date required"
    });
  }

  const result = predictionEngine.predict(date);

  res.json(result);
});

export default router;
