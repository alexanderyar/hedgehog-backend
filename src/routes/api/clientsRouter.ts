import express, {NextFunction, Request, Response} from "express";
import {ctrlWrapper} from "../../helpers";
import clientsController from "../../controllers/clients";
const router = express.Router();

import { authenticate, orderAuthenticate } from "../../middlewares";

//add/edit general information for the client
router.post(
  "/:clientId/general",
  authenticate,
  orderAuthenticate,
  ctrlWrapper(clientsController.clientsAddInfo.bind(clientsController))
);
//add bank info for the client
router.post(
    '/:client_id/bankInfo',
    authenticate,
    ctrlWrapper(clientsController.addBankInfo.bind(clientsController))
);

//remove shipment
router.delete(
    '/:clientId/shipInfo/:shipId',
    authenticate,
    ctrlWrapper(clientsController.deleteShipId.bind(clientsController))
)

router.get('/', ctrlWrapper(clientsController.getAllClients.bind(clientsController)));
router.get('/:id', ctrlWrapper(clientsController.getClientDetails.bind(clientsController)));
router.get('/:id/shipInfo', ctrlWrapper(clientsController.getClientShipDetails.bind(clientsController)));


router.post('/:id/contracts', ctrlWrapper(clientsController.uploadContract.bind(clientsController)))
router.get('/:clientId/contracts/:contractId', ctrlWrapper(clientsController.getContract.bind(clientsController)))

export default router;
