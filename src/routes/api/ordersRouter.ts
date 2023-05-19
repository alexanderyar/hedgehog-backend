import express, {NextFunction, Request, Response} from "express";
import {ctrlWrapper} from "../../helpers";
import orders from "../../controllers/orders";
const router = express.Router();

router.get('/', ctrlWrapper(orders.getAll))

export default router;