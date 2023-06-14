import express from "express";
const router = express.Router();
import supplyManagerControllers from "../../controllers/supplymanagers";
import { ctrlWrapper } from "../../helpers";
import { serviceGetSuppliers } from "../../controllers/service/serviceSuppliers";

router.get("/supinfo/", ctrlWrapper(supplyManagerControllers.getSupInfo));

router.get("/:supplier_id", ctrlWrapper(supplyManagerControllers.getSupById));

router.post("/", ctrlWrapper(supplyManagerControllers.AddNewSup));

router.patch("/:supplier_id", ctrlWrapper(supplyManagerControllers.editSup));

router.get("/services/suppliersid/", serviceGetSuppliers);

export default router;
