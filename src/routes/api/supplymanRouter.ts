import express from "express";
const router = express.Router();
import supplyManagerControllers from "../../controllers/supplymanagers";
import { ctrlWrapper } from "../../helpers";

router.get(
  "/supinfo/:manager_id",
  ctrlWrapper(supplyManagerControllers.getSupInfo)
);

router.get(
  "/:manager_id/:supplier_id",
  ctrlWrapper(supplyManagerControllers.getSupById)
);

router.post(
  "/:manager_id/addsup/",
  ctrlWrapper(supplyManagerControllers.AddNewSup)
);

router.patch(
  "/supinfoedit/:manager_id",
  ctrlWrapper(supplyManagerControllers.editSup)
);

export default router;
