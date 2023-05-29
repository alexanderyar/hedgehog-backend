import express, {NextFunction, Request, Response} from "express";
import nomenclature from "../../controllers/nomenclature";
import {ctrlWrapper} from "../../helpers";
import clientsController from "../../controllers/clients";
const router = express.Router();

router.get('/', ctrlWrapper(clientsController.getAllClients.bind(clientsController)));
router.get('/:id', ctrlWrapper(clientsController.getClientDetails.bind(clientsController)));

router.post('/:id/contracts', ctrlWrapper(clientsController.uploadContract.bind(clientsController)))
router.get('/:clientId/contracts/:contractId', ctrlWrapper(clientsController.uploadContract.bind(clientsController)))

export default router;