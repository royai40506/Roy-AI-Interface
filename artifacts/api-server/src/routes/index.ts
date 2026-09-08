import { Router, type IRouter } from "express";
import healthRouter from "./health";
import geminiRouter from "./groq-router";
import predictionRouter from "./prediction";
import backtestRouter from "./backtest";
import marketRouter from "./market";
import versionRouter from "./version";
import updateRouter from "./update";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/gemini", geminiRouter);
router.use("/prediction", predictionRouter);
router.use("/backtest", backtestRouter);
router.use("/market", marketRouter);
router.use("/version", versionRouter);
router.use("/update", updateRouter);

export default router;
