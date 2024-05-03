import { Router } from "express";
import dbRouter from "./dbRoutes.js";
import apiRouter from "./apiRoutes.js";

const router = Router();


router.use("/db",dbRouter);
router.use("/api",apiRouter);


export default router;
