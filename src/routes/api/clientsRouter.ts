import express from "express";
const router = express.Router();

import { authenticate, orderAuthenticate } from "../../middlewares";

import ctrl from "../../controllers/clients/";

router.post(
  "/:client_id/orders",
  authenticate,
  orderAuthenticate,
  ctrl.clientsCreateOrder
);

router.post(
  "/:client_id",
  authenticate,
  orderAuthenticate,
  ctrl.clientsAddInfo
);

export default router;
