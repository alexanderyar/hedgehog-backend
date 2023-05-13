import express from "express";
import nomenclatureRouter from "./api/nomenclatureRouter";
import authRouter from "./api/authRouter";
import serviceRouter from "./api/serviceRouter";
const router = express.Router();

router.use('/nomenclature', nomenclatureRouter);
router.use('/auth', authRouter);
router.use("/services", serviceRouter);


export default router;