import { Router } from "express";
import dbController from "../controllers/dbController.js";

const router = Router();

router.get("/sync", dbController.syncDB);
router.get("/insert-regions", dbController.insertRegions);

export default router;
