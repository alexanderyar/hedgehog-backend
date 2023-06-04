import express, {NextFunction, Request, Response} from "express";
import {ctrlWrapper} from "../../helpers";
import clientsController from "../../controllers/clients";
const router = express.Router();

import { authenticate, orderAuthenticate } from "../../middlewares";

router.post(
  "/:client_id/orders",
  authenticate,
  orderAuthenticate,
  clientsController.clientsCreateOrder.bind(clientsController)
);

router.post(
  "/:client_id",
  authenticate,
  orderAuthenticate,
  ctrlWrapper(clientsController.clientsAddInfo.bind(clientsController))
);

router.get('/', ctrlWrapper(clientsController.getAllClients.bind(clientsController)));
router.get('/:id', ctrlWrapper(clientsController.getClientDetails.bind(clientsController)));

router.post('/:id/contracts', ctrlWrapper(clientsController.uploadContract.bind(clientsController)))
router.get('/:clientId/contracts/:contractId', ctrlWrapper(clientsController.uploadContract.bind(clientsController)))

export default router;
