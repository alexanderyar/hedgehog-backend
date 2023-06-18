import express from "express";
import nomenclatureRouter from "./api/nomenclatureRouter";
import authRouter from "./api/authRouter";
import serviceRouter from "./api/serviceRouter";
import ordersRouter from "./api/ordersRouter";
import clientsRouter from "./api/clientsRouter";
import { authenticate } from "../middlewares";
import supplymanRouter from "./api/supplymanRouter";

const router = express.Router();
router.use("/services", serviceRouter);
router.use("/auth", authRouter);

router.use(authenticate);
router.use("/nomenclature", nomenclatureRouter);
router.use("/orders", ordersRouter);
router.use("/clients", clientsRouter);
router.use("/suppliers", supplymanRouter);

export default router;
