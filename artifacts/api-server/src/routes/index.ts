import { Router, type IRouter } from "express";
import healthRouter from "./health";
import geminiRouter from "./groq-router";
import predictionRouter from "./prediction";
import versionRouter from "./version";
import updateRouter from "./update";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/gemini", geminiRouter);
router.use("/prediction", predictionRouter);
router.use("/version", versionRouter);
router.use("/update", updateRouter);

export default router;
