import express from "express";
const router = express.Router();

import serviceCtrl from "../../controllers/service/";

router.get("/countries", serviceCtrl.serviceGetCountries);

export default router;
