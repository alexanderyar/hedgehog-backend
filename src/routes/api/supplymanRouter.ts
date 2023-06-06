import express from "express";
const router = express.Router();
import supplyManagerControllers from "../../controllers/supplymanagers";
import { ctrlWrapper } from "../../helpers";

router.get(
  "/supinfo/:manager_id",
  ctrlWrapper(supplyManagerControllers.getSupInfo)
);

router.post(
  "/:manager_id/addsup/",
  ctrlWrapper(supplyManagerControllers.AddNewSup)
);

export default router;
