import express from "express";
const router = express.Router();

import { authenticate } from "../../middlewares";

import ctrl from "../../controllers/buyers/";

router.get("/supinfo/:buyer_id", ctrl.getSupInfo);

export default router;
