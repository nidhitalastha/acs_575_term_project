import { Router } from "express";
import apiController from "../controllers/apiController.js";

const router = Router();

router.get("/regions", apiController.getRegions);

router.get("/ec2/pricing", apiController.getEC2Pricing);
router.get("/ec2/instances", apiController.getEC2Instances);
router.get("/ec2/instances/:instance_type", apiController.getEC2InstancesByType);


router.get("/rds/pricing", apiController.getRDSPricing);
router.get("/rds/instances", apiController.getRDSInstances);
router.get("/rds/instances/:instance_type", apiController.getRDSInstancesByType);


router.get("/estimates", apiController.getEstimates);
router.post("/estimates", apiController.postEstimates);
router.put("/estimates", apiController.updateEstimates);
router.delete("/estimates", apiController.deleteEstimates);

router.post("/estimates/resources", apiController.addResourceToEstimate);
router.put("/estimates/resources", apiController.updateResourceToEstimate);

export default router;
