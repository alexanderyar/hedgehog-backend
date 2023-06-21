import express, { NextFunction, Request, Response } from "express";
import nomenclature from "../../controllers/nomenclature";
import { ctrlWrapper } from "../../helpers";
import { validateBody } from "../../middlewares";
import { rowDataJoiSchema } from "../../models/rowData";

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
  "/parse/:formatted_id/",
  ctrlWrapper(nomenclature.parseNomenclature)
);

///////////////////////
//////////////////////
router.delete("/del/:sup_id", ctrlWrapper(nomenclature.deleteStocksBySup));

// Joi validation
router.post(
  "/addrow/",
  validateBody(rowDataJoiSchema),
  ctrlWrapper(nomenclature.addResolvedRow)
);

// storing deleted rows for analytycs
router.post("/deletedrow/", ctrlWrapper(nomenclature.addDeletedRowAnalytycs));

router.get('/:id', ctrlWrapper(nomenclature.getById))

export default router;
