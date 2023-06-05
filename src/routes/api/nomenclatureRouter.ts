import express, { NextFunction, Request, Response } from "express";
import nomenclature from "../../controllers/nomenclature";
import { ctrlWrapper } from "../../helpers";

const router = express.Router();

router.get(
  "/",
  ctrlWrapper(
    (
      req: Request<
        null,
        null,
        null,
        {
          skip?: string;
          take?: string;
        }
      >,
      res: Response,
      next: NextFunction
    ) => {
      nomenclature.getAll(req, res, next);
    }
  )
);
router.get(
  "/available",
  ctrlWrapper(
    (
      req: Request<
        null,
        null,
        null,
        {
          skip?: string;
          take?: string;
          number?: string;
        }
      >,
      res: Response,
      next: NextFunction,
      findOptions: {
        skip: number;
        take: number;
        number?: string;
      }
    ) => {
      nomenclature.getAvailable(req, res, next, findOptions);
    }
  )
);
router.get(
  "/:id/replacement",
  ctrlWrapper(nomenclature.getReplacement.bind(nomenclature))
);
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
router.post("/parse", ctrlWrapper(nomenclature.parseNomenclature));

///////////////////////
//////////////////////
router.delete("/del/:sup_id", ctrlWrapper(nomenclature.deleteStocksBySup));

export default router;
