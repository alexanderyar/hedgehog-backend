import express, { NextFunction, Request, Response } from "express";
import nomenclature from "../../controllers/nomenclature";
import { ctrlWrapper } from "../../helpers";

const router = express.Router();

router.get(
  "/",
  ctrlWrapper(
      nomenclature.getAll.bind(nomenclature)
  )
);
router.get(
    "/row",
    ctrlWrapper(nomenclature.getAllRow.bind(nomenclature))
);
router.get(
    "/:id/replacement/row",
    ctrlWrapper(nomenclature.getReplacementRow.bind(nomenclature))
);
router.get(
  "/available",
  ctrlWrapper(nomenclature.getAvailable.bind(nomenclature))
);
router.get(
  "/:id/replacement",
  ctrlWrapper(nomenclature.getReplacement.bind(nomenclature))
);
router.post(
  "/:id/replacement",
  ctrlWrapper(nomenclature.addReplacement.bind(nomenclature))
);

router.delete('/:id/replacement/:replacementId', nomenclature.removeReplacement.bind(nomenclature))


router.get(
  "/:id/datasheet",
  ctrlWrapper(nomenclature.getDatasheet.bind(nomenclature))
);
router.post(
  "/:id/datasheet",
  ctrlWrapper(nomenclature.saveDatasheet.bind(nomenclature))
);
///////////////////////
//////////////////////
router.post(
  "/parse/:supplier_id/",
  ctrlWrapper(nomenclature.parseNomenclature)
);

///////////////////////
//////////////////////
router.delete("/del/:sup_id", ctrlWrapper(nomenclature.deleteStocksBySup));

router.get('/:id', ctrlWrapper(nomenclature.getById))

export default router;
